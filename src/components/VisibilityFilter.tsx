import { ToolPath, Vertex } from '@/types/command';


//function filterExteriorPaths(points: Point[], delta: number): Line[] {
//    const hashable = 1000;  // multiplier to make the z-axis easily hashable
//    const validScaledPoints: Point[] = [];
//    for (const point of points) {
//        if (point.z > 0) {
//            validScaledPoints.push({
//                ...point,
//                z: Math.floor(point.z * hashable)
//            });
//        }
//    }
//
//    var loops: Map<number, Path[][]> = new Map();
//    var lastJog: {z: number, point: Point} = {z: 0, point: {x: 0, y: 0, z: 0}};
//    var lastWasJog: {z: number, wasJog: boolean} = {z: 0, wasJog: false};
//    var outputPaths: Path[] = [];
//
//    var minExtrudedZ = 1000000;
//    for (const point of validScaledPoints) {
//        if (point.z < minExtrudedZ) {
//            minExtrudedZ = point.z;
//        }
//    }
//    console.log("minExtrudedZ", minExtrudedZ);
//
//    var lastPoint: Point = { x: 0, y: 0, z: 0 };
//    var provisionalLoop: Path[] = [];
//
//    // Skip past some setup stuff
//    var firstMinExtrudedZ = 0;
//    for (const point of validScaledPoints) {
//        if (point.z == minExtrudedZ) {
//            break;
//        }
//        firstMinExtrudedZ++;
//    }
//
//    console.log("validScaledPoints", validScaledPoints);
//
//    // Process the paths
//    for (const point of validScaledPoints.slice(firstMinExtrudedZ, -1)) {
//        if (minExtrudedZ == point.z) {
//            outputPaths.push({ start: lastJog.point, end: point });
//            lastJog = {z: point.z, point: point};
//        }
//    }
//
//    for (const layer of loops.values()) {
//        var i = 0;
//        for (const innermostLoop of layer) {
//            console.log("innermost", innermostLoop);
//            console.log("innermost length", innermostLoop.length);
//            for (const path of innermostLoop) {
//                outputPaths.push(path);
//            }
//            i++;
//        }
//    }
//    console.log("outputPaths", outputPaths);
//
//    // Unscale the paths
//    const unscaledPaths = outputPaths.map(path => {
//        return {
//            start: {
//                x: path.start.x,
//                y: path.start.y,
//                z: path.start.z / hashable
//            },
//            end: {
//                x: path.end.x,
//                y: path.end.y,
//                z: path.end.z / hashable
//            }
//        }
//    });
//    return unscaledPaths;
//}

// TODO: need a perimeterToolPaths funciton

export function perimeterLoops(loops: ToolPath[][], delta: number): {outermost: ToolPath[], innermost: ToolPath[][]} {
    var nestings: [number, number, number][] = []; // loop index, number of loops it's insdie of, number of loops outside of
    loops.forEach((loop, index) => {
        nestings.push([index, 0, 0]);
    });
    for (const [innerLoopIndex, innerLoop] of loops.entries()) {
        if (innerLoop.length === 0) {
            continue;
        }
        for (const [outerLoopIndex, outerLoop] of loops.entries()) {
            if (innerLoopIndex === outerLoopIndex) {
                continue;
            }
            var adjacent = 0;
            for (const toolPath of outerLoop) {
                if (isAdjacent(innerLoop[0].start, toolPath)) {
                    adjacent++;
                }
            }
            if (adjacent % 2 > 0) {
                // inner loop is inside of outer loop
                nestings[innerLoopIndex][1]++;
                // outer loop is outside of inner loop
                nestings[outerLoopIndex][2]++;
            }
        }
    }

    var outermost: ToolPath[] = [];
    var innermost: ToolPath[][] = [];
    nestings.forEach(([loopIndex, countOutsideOfIt, countInsideOfIt]) => {
        if (countOutsideOfIt === 0) {
            outermost = loops[loopIndex];
        }
        if (countInsideOfIt === 0) {
            innermost.push(loops[loopIndex]);
        }
    });

    return {outermost, innermost};
}

// Watches the tool paths to find loops
export function findToolPathLoops(toolPaths: ToolPath[]): ToolPath[][] {
    var loops: ToolPath[][] = [];
    var inLoop: boolean = false;
    var thisLoop: ToolPath[] = [];
    for (const toolPath of toolPaths) {
        if (!toolPath.isExtrusion && inLoop) {
            // just had a potential loop stop printing, wasn't a loop
            inLoop = false;
            thisLoop = [];
        } else if (toolPath.isExtrusion) {
            // are extruding
            if (!inLoop) {
                // just started printing, maybe in a loop
                inLoop = true;
                thisLoop.push(toolPath);
            } else if (!aboutEqual(thisLoop[0].start, toolPath.end, 0.5)) {
                // printing, and in a loop, but not done a loop
                thisLoop.push(toolPath);
            } else {
                // just finished a loop
                thisLoop.push(toolPath);
                if (thisLoop.length > 2) {
                    loops.push(thisLoop);
                }
                inLoop = false;
                thisLoop = [];
            }
        }
    }
    return loops;
}

// Checks to see if a virtex is to the left of, and adjacent to, the tool path
// Only pays attention to the x and y-axes, not the z-axis
export function isAdjacent(vertex: Vertex, toolPath: ToolPath): boolean {
    if (Math.abs(vertex.y - toolPath.start.y) < 0.005 && vertex.x < toolPath.start.x) {
        return true;
    }

    if (Math.abs(vertex.y - toolPath.end.y) < 0.005) {
        return false;
    }
    
    const minY = Math.min(toolPath.start.y, toolPath.end.y); 
    if (minY > vertex.y) {
        return false;
    }

    const maxY = Math.max(toolPath.start.y, toolPath.end.y);
    if (maxY < vertex.y) {
        return false;
    }

    if (Math.abs(toolPath.start.x - toolPath.end.x) < 0.005) {
        if (vertex.x < toolPath.start.x) {
            return true;
        } else {
            return false;
        }
    }

    const slope = (toolPath.end.y - toolPath.start.y) / (toolPath.end.x - toolPath.start.x);
    const yIntercept = toolPath.start.y - slope * toolPath.start.x;
    const x = (vertex.y - yIntercept) / slope;
    if (x < vertex.x) {
        return false;
    }
    return true;
}

// Checks to see if two vertices are about equal
// Only pays attention to the x and y-axes, not the z-axis
export function aboutEqual(vertex1: Vertex, vertex2: Vertex, delta: number): boolean {
    return (Math.abs(vertex1.x - vertex2.x) < delta) && (Math.abs(vertex1.y - vertex2.y) < delta);
}
