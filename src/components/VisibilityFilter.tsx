import { ToolPath, Vertex } from '@/types/spatial';


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
//
//function perimeterLoops(loops: Path[][], delta: number): {outermost: Path[], innermost: Path[][]} {
//    var countInside: number[] = [];
//    for (const loop of loops) {
//        if (loop.length == 0) {
//            continue;
//        }
//        var countInsideLoop = 0;
//        for (const otherLoop of loops) {
//            var adjacent = 0;
//            for (const path of otherLoop) {
//                if (isAdjacent(loop[0].start, path)) {
//                    adjacent++;
//                }
//            }
//            if (adjacent % 2 > 0) {
//                countInsideLoop++;
//            }
//        }
//        countInside.push(countInsideLoop);
//    }
//
//    var outermost: Path[] = [];
//    var outermostCount = -1;
//    var innermost: Path[][] = [];
//    for (var i = 0; i < countInside.length; i++) {
//        if (countInside[i] > outermostCount) {
//            outermost = loops[i];
//            outermostCount = countInside[i];
//        }
//        if (countInside[i] == 0) {
//            innermost.push(loops[i]);
//        }
//    }
//    return {outermost, innermost};
//}

// Checks to see if a virtex is to the left of, and adjacent to, the tool path
// Only pays attention to the x and y-axes, not the z-axis
export function isAdjacent(vertex: Vertex, toolPath: ToolPath): boolean {
    if (vertex.y === toolPath.start.y) {
        return true;
    }
    if (vertex.y === toolPath.end.y) {
        return false;
    }
    
    const minY = Math.min(toolPath.start.y, toolPath.end.y); 
    if (minY > vertex.y && minY > vertex.y) {
        return false;
    }

    const maxY = Math.max(toolPath.start.y, toolPath.end.y);
    if (maxY < vertex.y && maxY < vertex.y) {
        return false;
    }

    const slope = (toolPath.end.y - toolPath.start.y) / (toolPath.end.x - toolPath.start.x);
    const yIntercept = toolPath.start.y - slope * toolPath.start.x;
    const x = (vertex.y - yIntercept) / slope;
    if (x < vertex.x) {
        return true;
    }
    return false;
}

export function aboutEqual(vertex1: Vertex, vertex2: Vertex, delta: number): boolean {
    return (Math.abs(vertex1.x - vertex2.x) < delta) && (Math.abs(vertex1.y - vertex2.y) < delta);
}
