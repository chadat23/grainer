; HEADER_BLOCK_START
; BambuStudio 02.00.02.57
; model printing time: 2m 13s; total estimated time: 8m 28s
; total layer number: 25
; total filament length [mm] : 146.55
; total filament volume [cm^3] : 352.49
; total filament weight [g] : 0.44
; filament_density: 1.26
; filament_diameter: 1.75
; max_z_height: 5.00
; HEADER_BLOCK_END

; CONFIG_BLOCK_START
; accel_to_decel_enable = 0
; accel_to_decel_factor = 50%
; activate_air_filtration = 0
; additional_cooling_fan_speed = 70
; apply_scarf_seam_on_circles = 1
; auxiliary_fan = 1
; bed_custom_model = 
; bed_custom_texture = 
; bed_exclude_area = 0x0,18x0,18x28,0x28
; bed_temperature_formula = by_first_filament
; before_layer_change_gcode = 
; best_object_pos = 0.5,0.5
; bottom_color_penetration_layers = 3
; bottom_shell_layers = 3
; bottom_shell_thickness = 0
; bottom_surface_pattern = monotonic
; bridge_angle = 0
; bridge_flow = 1
; bridge_no_support = 0
; bridge_speed = 50
; brim_object_gap = 0.1
; brim_type = auto_brim
; brim_width = 5
; chamber_temperatures = 0
; change_filament_gcode = M620 S[next_extruder]A\nM204 S9000\nG1 Z{max_layer_z + 3.0} F1200\n\nG1 X70 F21000\nG1 Y245\nG1 Y265 F3000\nM400\nM106 P1 S0\nM106 P2 S0\n{if old_filament_temp > 142 && next_extruder < 255}\nM104 S[old_filament_temp]\n{endif}\n{if long_retractions_when_cut[previous_extruder]}\nM620.11 S1 I[previous_extruder] E-{retraction_distances_when_cut[previous_extruder]} F{old_filament_e_feedrate}\n{else}\nM620.11 S0\n{endif}\nM400\nG1 X90 F3000\nG1 Y255 F4000\nG1 X100 F5000\nG1 X120 F15000\nG1 X20 Y50 F21000\nG1 Y-3\n{if toolchange_count == 2}\n; get travel path for change filament\nM620.1 X[travel_point_1_x] Y[travel_point_1_y] F21000 P0\nM620.1 X[travel_point_2_x] Y[travel_point_2_y] F21000 P1\nM620.1 X[travel_point_3_x] Y[travel_point_3_y] F21000 P2\n{endif}\nM620.1 E F[old_filament_e_feedrate] T{nozzle_temperature_range_high[previous_extruder]}\nT[next_extruder]\nM620.1 E F[new_filament_e_feedrate] T{nozzle_temperature_range_high[next_extruder]}\n\n{if next_extruder < 255}\n{if long_retractions_when_cut[previous_extruder]}\nM620.11 S1 I[previous_extruder] E{retraction_distances_when_cut[previous_extruder]} F{old_filament_e_feedrate}\nM628 S1\nG92 E0\nG1 E{retraction_distances_when_cut[previous_extruder]} F[old_filament_e_feedrate]\nM400\nM629 S1\n{else}\nM620.11 S0\n{endif}\nG92 E0\n{if flush_length_1 > 1}\nM83\n; FLUSH_START\n; always use highest temperature to flush\nM400\n{if filament_type[next_extruder] == "PETG"}\nM109 S260\n{elsif filament_type[next_extruder] == "PVA"}\nM109 S210\n{else}\nM109 S[nozzle_temperature_range_high]\n{endif}\n{if flush_length_1 > 23.7}\nG1 E23.7 F{old_filament_e_feedrate} ; do not need pulsatile flushing for start part\nG1 E{(flush_length_1 - 23.7) * 0.02} F50\nG1 E{(flush_length_1 - 23.7) * 0.23} F{old_filament_e_feedrate}\nG1 E{(flush_length_1 - 23.7) * 0.02} F50\nG1 E{(flush_length_1 - 23.7) * 0.23} F{new_filament_e_feedrate}\nG1 E{(flush_length_1 - 23.7) * 0.02} F50\nG1 E{(flush_length_1 - 23.7) * 0.23} F{new_filament_e_feedrate}\nG1 E{(flush_length_1 - 23.7) * 0.02} F50\nG1 E{(flush_length_1 - 23.7) * 0.23} F{new_filament_e_feedrate}\n{else}\nG1 E{flush_length_1} F{old_filament_e_feedrate}\n{endif}\n; FLUSH_END\nG1 E-[old_retract_length_toolchange] F1800\nG1 E[old_retract_length_toolchange] F300\n{endif}\n\n{if flush_length_2 > 1}\n\nG91\nG1 X3 F12000; move aside to extrude\nG90\nM83\n\n; FLUSH_START\nG1 E{flush_length_2 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_2 * 0.02} F50\nG1 E{flush_length_2 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_2 * 0.02} F50\nG1 E{flush_length_2 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_2 * 0.02} F50\nG1 E{flush_length_2 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_2 * 0.02} F50\nG1 E{flush_length_2 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_2 * 0.02} F50\n; FLUSH_END\nG1 E-[new_retract_length_toolchange] F1800\nG1 E[new_retract_length_toolchange] F300\n{endif}\n\n{if flush_length_3 > 1}\n\nG91\nG1 X3 F12000; move aside to extrude\nG90\nM83\n\n; FLUSH_START\nG1 E{flush_length_3 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_3 * 0.02} F50\nG1 E{flush_length_3 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_3 * 0.02} F50\nG1 E{flush_length_3 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_3 * 0.02} F50\nG1 E{flush_length_3 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_3 * 0.02} F50\nG1 E{flush_length_3 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_3 * 0.02} F50\n; FLUSH_END\nG1 E-[new_retract_length_toolchange] F1800\nG1 E[new_retract_length_toolchange] F300\n{endif}\n\n{if flush_length_4 > 1}\n\nG91\nG1 X3 F12000; move aside to extrude\nG90\nM83\n\n; FLUSH_START\nG1 E{flush_length_4 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_4 * 0.02} F50\nG1 E{flush_length_4 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_4 * 0.02} F50\nG1 E{flush_length_4 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_4 * 0.02} F50\nG1 E{flush_length_4 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_4 * 0.02} F50\nG1 E{flush_length_4 * 0.18} F{new_filament_e_feedrate}\nG1 E{flush_length_4 * 0.02} F50\n; FLUSH_END\n{endif}\n; FLUSH_START\nM400\nM109 S[new_filament_temp]\nG1 E2 F{new_filament_e_feedrate} ;Compensate for filament spillage during waiting temperature\n; FLUSH_END\nM400\nG92 E0\nG1 E-[new_retract_length_toolchange] F1800\nM106 P1 S255\nM400 S3\n\nG1 X70 F5000\nG1 X90 F3000\nG1 Y255 F4000\nG1 X105 F5000\nG1 Y265 F5000\nG1 X70 F10000\nG1 X100 F5000\nG1 X70 F10000\nG1 X100 F5000\n\nG1 X70 F10000\nG1 X80 F15000\nG1 X60\nG1 X80\nG1 X60\nG1 X80 ; shake to put down garbage\nG1 X100 F5000\nG1 X165 F15000; wipe and shake\nG1 Y256 ; move Y to aside, prevent collision\nM400\nG1 Z{max_layer_z + 3.0} F3000\n{if layer_z <= (initial_layer_print_height + 0.001)}\nM204 S[initial_layer_acceleration]\n{else}\nM204 S[default_acceleration]\n{endif}\n{else}\nG1 X[x_after_toolchange] Y[y_after_toolchange] Z[z_after_toolchange] F12000\n{endif}\nM621 S[next_extruder]A\n
; circle_compensation_manual_offset = 0
; circle_compensation_speed = 200
; close_fan_the_first_x_layers = 1
; complete_print_exhaust_fan_speed = 70
; cool_plate_temp = 35
; cool_plate_temp_initial_layer = 35
; counter_coef_1 = 0
; counter_coef_2 = 0.008
; counter_coef_3 = -0.041
; counter_limit_max = 0.033
; counter_limit_min = -0.035
; curr_bed_type = Textured PEI Plate
; default_acceleration = 10000
; default_filament_colour = ""
; default_filament_profile = "Bambu PLA Basic @BBL X1C"
; default_jerk = 0
; default_nozzle_volume_type = Standard
; default_print_profile = 0.20mm Standard @BBL X1C
; deretraction_speed = 30
; detect_floating_vertical_shell = 1
; detect_narrow_internal_solid_infill = 1
; detect_overhang_wall = 1
; detect_thin_wall = 0
; diameter_limit = 50
; draft_shield = disabled
; during_print_exhaust_fan_speed = 70
; elefant_foot_compensation = 0.15
; enable_arc_fitting = 1
; enable_circle_compensation = 0
; enable_long_retraction_when_cut = 2
; enable_overhang_bridge_fan = 1
; enable_overhang_speed = 1
; enable_pre_heating = 0
; enable_pressure_advance = 0
; enable_prime_tower = 0
; enable_support = 0
; enforce_support_layers = 0
; eng_plate_temp = 0
; eng_plate_temp_initial_layer = 0
; ensure_vertical_shell_thickness = enabled
; exclude_object = 1
; extruder_ams_count = 1#0|4#0;1#0|4#0
; extruder_clearance_dist_to_rod = 33
; extruder_clearance_height_to_lid = 90
; extruder_clearance_height_to_rod = 34
; extruder_clearance_max_radius = 68
; extruder_colour = #018001
; extruder_offset = 0x2
; extruder_printable_area = 
; extruder_type = Direct Drive
; extruder_variant_list = "Direct Drive Standard"
; fan_cooling_layer_time = 100
; fan_max_speed = 100
; fan_min_speed = 100
; filament_adhesiveness_category = 100
; filament_change_length = 5
; filament_colour = #00AE42
; filament_cost = 24.99
; filament_density = 1.26
; filament_diameter = 1.75
; filament_end_gcode = "; filament end gcode \n\n"
; filament_extruder_variant = "Direct Drive Standard"
; filament_flow_ratio = 0.98
; filament_ids = GFA00
; filament_is_support = 0
; filament_long_retractions_when_cut = 1
; filament_map = 1
; filament_map_mode = Auto For Flush
; filament_max_volumetric_speed = 21
; filament_minimal_purge_on_wipe_tower = 15
; filament_notes = 
; filament_pre_cooling_temperature = 0
; filament_prime_volume = 30
; filament_ramming_travel_time = 0
; filament_ramming_volumetric_speed = -1
; filament_retraction_distances_when_cut = 18
; filament_scarf_gap = 0%
; filament_scarf_height = 10%
; filament_scarf_length = 10
; filament_scarf_seam_type = none
; filament_self_index = 1
; filament_settings_id = "Bambu PLA Basic @BBL X1C"
; filament_shrink = 100%
; filament_soluble = 0
; filament_start_gcode = "; filament start gcode\n{if  (bed_temperature[current_extruder] >55)||(bed_temperature_initial_layer[current_extruder] >55)}M106 P3 S200\n{elsif(bed_temperature[current_extruder] >50)||(bed_temperature_initial_layer[current_extruder] >50)}M106 P3 S150\n{elsif(bed_temperature[current_extruder] >45)||(bed_temperature_initial_layer[current_extruder] >45)}M106 P3 S50\n{endif}\nM142 P1 R35 S40\n{if activate_air_filtration[current_extruder] && support_air_filtration}\nM106 P3 S{during_print_exhaust_fan_speed_num[current_extruder]} \n{endif}"
; filament_type = PLA
; filament_vendor = "Bambu Lab"
; filename_format = {input_filename_base}_{filament_type[0]}_{print_time}.gcode
; filter_out_gap_fill = 0
; first_layer_print_sequence = 0
; flush_into_infill = 0
; flush_into_objects = 0
; flush_into_support = 1
; flush_multiplier = 1
; flush_volumes_matrix = 0
; flush_volumes_vector = 140,140
; full_fan_speed_layer = 0
; fuzzy_skin = none
; fuzzy_skin_point_distance = 0.8
; fuzzy_skin_thickness = 0.3
; gap_infill_speed = 250
; gcode_add_line_number = 0
; gcode_flavor = marlin
; grab_length = 0
; has_scarf_joint_seam = 1
; head_wrap_detect_zone = 
; hole_coef_1 = 0
; hole_coef_2 = -0.008
; hole_coef_3 = 0.23415
; hole_limit_max = 0.22
; hole_limit_min = 0.088
; host_type = octoprint
; hot_plate_temp = 55
; hot_plate_temp_initial_layer = 55
; hotend_cooling_rate = 2
; hotend_heating_rate = 2
; impact_strength_z = 13.8
; independent_support_layer_height = 1
; infill_combination = 0
; infill_direction = 45
; infill_jerk = 9
; infill_rotate_step = 0
; infill_shift_step = 0.4
; infill_wall_overlap = 15%
; initial_layer_acceleration = 500
; initial_layer_flow_ratio = 1
; initial_layer_infill_speed = 105
; initial_layer_jerk = 9
; initial_layer_line_width = 0.5
; initial_layer_print_height = 0.2
; initial_layer_speed = 50
; initial_layer_travel_acceleration = 6000
; inner_wall_acceleration = 0
; inner_wall_jerk = 9
; inner_wall_line_width = 0.45
; inner_wall_speed = 300
; interface_shells = 0
; interlocking_beam = 0
; interlocking_beam_layer_count = 2
; interlocking_beam_width = 0.8
; interlocking_boundary_avoidance = 2
; interlocking_depth = 2
; interlocking_orientation = 22.5
; internal_bridge_support_thickness = 0.8
; internal_solid_infill_line_width = 0.42
; internal_solid_infill_pattern = zig-zag
; internal_solid_infill_speed = 250
; ironing_direction = 45
; ironing_flow = 10%
; ironing_inset = 0.21
; ironing_pattern = zig-zag
; ironing_spacing = 0.15
; ironing_speed = 30
; ironing_type = no ironing
; is_infill_first = 0
; layer_change_gcode = ; layer num/total_layer_count: {layer_num+1}/[total_layer_count]\n; update layer progress\nM73 L{layer_num+1}\nM991 S0 P{layer_num} ;notify layer change
; layer_height = 0.2
; line_width = 0.42
; long_retractions_when_cut = 0
; machine_end_gcode = ;===== date: 20230428 =====================\nM400 ; wait for buffer to clear\nG92 E0 ; zero the extruder\nG1 E-0.8 F1800 ; retract\nG1 Z{max_layer_z + 0.5} F900 ; lower z a little\nG1 X65 Y245 F12000 ; move to safe pos \nG1 Y265 F3000\n\nG1 X65 Y245 F12000\nG1 Y265 F3000\nM140 S0 ; turn off bed\nM106 S0 ; turn off fan\nM106 P2 S0 ; turn off remote part cooling fan\nM106 P3 S0 ; turn off chamber cooling fan\n\nG1 X100 F12000 ; wipe\n; pull back filament to AMS\nM620 S255\nG1 X20 Y50 F12000\nG1 Y-3\nT255\nG1 X65 F12000\nG1 Y265\nG1 X100 F12000 ; wipe\nM621 S255\nM104 S0 ; turn off hotend\n\nM622.1 S1 ; for prev firware, default turned on\nM1002 judge_flag timelapse_record_flag\nM622 J1\n    M400 ; wait all motion done\n    M991 S0 P-1 ;end smooth timelapse at safe pos\n    M400 S3 ;wait for last picture to be taken\nM623; end of "timelapse_record_flag"\n\nM400 ; wait all motion done\nM17 S\nM17 Z0.4 ; lower z motor current to reduce impact if there is something in the bottom\n{if (max_layer_z + 100.0) < 250}\n    G1 Z{max_layer_z + 100.0} F600\n    G1 Z{max_layer_z +98.0}\n{else}\n    G1 Z250 F600\n    G1 Z248\n{endif}\nM400 P100\nM17 R ; restore z current\n\nM220 S100  ; Reset feedrate magnitude\nM201.2 K1.0 ; Reset acc magnitude\nM73.2   R1.0 ;Reset left time magnitude\nM1002 set_gcode_claim_speed_level : 0\n\nM17 X0.8 Y0.8 Z0.5 ; lower motor current to 45% power\n
; machine_load_filament_time = 29
; machine_max_acceleration_e = 5000,5000
; machine_max_acceleration_extruding = 20000,20000
; machine_max_acceleration_retracting = 5000,5000
; machine_max_acceleration_travel = 9000,9000
; machine_max_acceleration_x = 20000,20000
; machine_max_acceleration_y = 20000,20000
; machine_max_acceleration_z = 500,200
; machine_max_jerk_e = 2.5,2.5
; machine_max_jerk_x = 9,9
; machine_max_jerk_y = 9,9
; machine_max_jerk_z = 3,3
; machine_max_speed_e = 30,30
; machine_max_speed_x = 500,200
; machine_max_speed_y = 500,200
; machine_max_speed_z = 20,20
; machine_min_extruding_rate = 0,0
; machine_min_travel_rate = 0,0
; machine_pause_gcode = M400 U1
; machine_start_gcode = ;===== machine: P1S ========================\n;===== date: 20231107 =====================\n;===== turn on the HB fan & MC board fan =================\nM104 S75 ;set extruder temp to turn on the HB fan and prevent filament oozing from nozzle\nM710 A1 S255 ;turn on MC fan by default(P1S)\n;===== reset machine status =================\nM290 X40 Y40 Z2.6666666\nG91\nM17 Z0.4 ; lower the z-motor current\nG380 S2 Z30 F300 ; G380 is same as G38; lower the hotbed , to prevent the nozzle is below the hotbed\nG380 S2 Z-25 F300 ;\nG1 Z5 F300;\nG90\nM17 X1.2 Y1.2 Z0.75 ; reset motor current to default\nM960 S5 P1 ; turn on logo lamp\nG90\nM220 S100 ;Reset Feedrate\nM221 S100 ;Reset Flowrate\nM73.2   R1.0 ;Reset left time magnitude\nM1002 set_gcode_claim_speed_level : 5\nM221 X0 Y0 Z0 ; turn off soft endstop to prevent protential logic problem\nG29.1 Z{+0.0} ; clear z-trim value first\nM204 S10000 ; init ACC set to 10m/s^2\n\n;===== heatbed preheat ====================\nM1002 gcode_claim_action : 2\nM140 S[bed_temperature_initial_layer_single] ;set bed temp\nM190 S[bed_temperature_initial_layer_single] ;wait for bed temp\n\n\n\n;=============turn on fans to prevent PLA jamming=================\n{if filament_type[initial_extruder]=="PLA"}\n    {if (bed_temperature[initial_extruder] >45)||(bed_temperature_initial_layer[initial_extruder] >45)}\n    M106 P3 S180\n    {endif};Prevent PLA from jamming\n{endif}\nM106 P2 S100 ; turn on big fan ,to cool down toolhead\n\n;===== prepare print temperature and material ==========\nM104 S[nozzle_temperature_initial_layer] ;set extruder temp\nG91\nG0 Z10 F1200\nG90\nG28 X\nM975 S1 ; turn on\nG1 X60 F12000\nG1 Y245\nG1 Y265 F3000\nM620 M\nM620 S[initial_extruder]A   ; switch material if AMS exist\n    M109 S[nozzle_temperature_initial_layer]\n    G1 X120 F12000\n\n    G1 X20 Y50 F12000\n    G1 Y-3\n    T[initial_extruder]\n    G1 X54 F12000\n    G1 Y265\n    M400\nM621 S[initial_extruder]A\nM620.1 E F{filament_max_volumetric_speed[initial_extruder]/2.4053*60} T{nozzle_temperature_range_high[initial_extruder]}\n\n\nM412 S1 ; ===turn on filament runout detection===\n\nM109 S250 ;set nozzle to common flush temp\nM106 P1 S0\nG92 E0\nG1 E50 F200\nM400\nM104 S[nozzle_temperature_initial_layer]\nG92 E0\nG1 E50 F200\nM400\nM106 P1 S255\nG92 E0\nG1 E5 F300\nM109 S{nozzle_temperature_initial_layer[initial_extruder]-20} ; drop nozzle temp, make filament shink a bit\nG92 E0\nG1 E-0.5 F300\n\nG1 X70 F9000\nG1 X76 F15000\nG1 X65 F15000\nG1 X76 F15000\nG1 X65 F15000; shake to put down garbage\nG1 X80 F6000\nG1 X95 F15000\nG1 X80 F15000\nG1 X165 F15000; wipe and shake\nM400\nM106 P1 S0\n;===== prepare print temperature and material end =====\n\n\n;===== wipe nozzle ===============================\nM1002 gcode_claim_action : 14\nM975 S1\nM106 S255\nG1 X65 Y230 F18000\nG1 Y264 F6000\nM109 S{nozzle_temperature_initial_layer[initial_extruder]-20}\nG1 X100 F18000 ; first wipe mouth\n\nG0 X135 Y253 F20000  ; move to exposed steel surface edge\nG28 Z P0 T300; home z with low precision,permit 300deg temperature\nG29.2 S0 ; turn off ABL\nG0 Z5 F20000\n\nG1 X60 Y265\nG92 E0\nG1 E-0.5 F300 ; retrack more\nG1 X100 F5000; second wipe mouth\nG1 X70 F15000\nG1 X100 F5000\nG1 X70 F15000\nG1 X100 F5000\nG1 X70 F15000\nG1 X100 F5000\nG1 X70 F15000\nG1 X90 F5000\nG0 X128 Y261 Z-1.5 F20000  ; move to exposed steel surface and stop the nozzle\nM104 S140 ; set temp down to heatbed acceptable\nM106 S255 ; turn on fan (G28 has turn off fan)\n\nM221 S; push soft endstop status\nM221 Z0 ;turn off Z axis endstop\nG0 Z0.5 F20000\nG0 X125 Y259.5 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y262.5\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y260.0\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y262.0\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y260.5\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y261.5\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 Z0.5 F20000\nG0 X125 Y261.0\nG0 Z-1.01\nG0 X131 F211\nG0 X124\nG0 X128\nG2 I0.5 J0 F300\nG2 I0.5 J0 F300\nG2 I0.5 J0 F300\nG2 I0.5 J0 F300\n\nM109 S140 ; wait nozzle temp down to heatbed acceptable\nG2 I0.5 J0 F3000\nG2 I0.5 J0 F3000\nG2 I0.5 J0 F3000\nG2 I0.5 J0 F3000\n\nM221 R; pop softend status\nG1 Z10 F1200\nM400\nG1 Z10\nG1 F30000\nG1 X230 Y15\nG29.2 S1 ; turn on ABL\n;G28 ; home again after hard wipe mouth\nM106 S0 ; turn off fan , too noisy\n;===== wipe nozzle end ================================\n\n\n;===== bed leveling ==================================\nM1002 judge_flag g29_before_print_flag\nM622 J1\n\n    M1002 gcode_claim_action : 1\n    G29 A X{first_layer_print_min[0]} Y{first_layer_print_min[1]} I{first_layer_print_size[0]} J{first_layer_print_size[1]}\n    M400\n    M500 ; save cali data\n\nM623\n;===== bed leveling end ================================\n\n;===== home after wipe mouth============================\nM1002 judge_flag g29_before_print_flag\nM622 J0\n\n    M1002 gcode_claim_action : 13\n    G28\n\nM623\n;===== home after wipe mouth end =======================\n\nM975 S1 ; turn on vibration supression\n\n\n;=============turn on fans to prevent PLA jamming=================\n{if filament_type[initial_extruder]=="PLA"}\n    {if (bed_temperature[initial_extruder] >45)||(bed_temperature_initial_layer[initial_extruder] >45)}\n    M106 P3 S180\n    {endif};Prevent PLA from jamming\n{endif}\nM106 P2 S100 ; turn on big fan ,to cool down toolhead\n\n\nM104 S{nozzle_temperature_initial_layer[initial_extruder]} ; set extrude temp earlier, to reduce wait time\n\n;===== mech mode fast check============================\nG1 X128 Y128 Z10 F20000\nM400 P200\nM970.3 Q1 A7 B30 C80  H15 K0\nM974 Q1 S2 P0\n\nG1 X128 Y128 Z10 F20000\nM400 P200\nM970.3 Q0 A7 B30 C90 Q0 H15 K0\nM974 Q0 S2 P0\n\nM975 S1\nG1 F30000\nG1 X230 Y15\nG28 X ; re-home XY\n;===== fmech mode fast check============================\n\n\n;===== nozzle load line ===============================\nM975 S1\nG90\nM83\nT1000\nG1 X18.0 Y1.0 Z0.8 F18000;Move to start position\nM109 S{nozzle_temperature_initial_layer[initial_extruder]}\nG1 Z0.2\nG0 E2 F300\nG0 X240 E15 F{outer_wall_volumetric_speed/(0.3*0.5)     * 60}\nG0 Y11 E0.700 F{outer_wall_volumetric_speed/(0.3*0.5)/ 4 * 60}\nG0 X239.5\nG0 E0.2\nG0 Y1.5 E0.700\nG0 X18 E15 F{outer_wall_volumetric_speed/(0.3*0.5)     * 60}\nM400\n\n;===== for Textured PEI Plate , lower the nozzle as the nozzle was touching topmost of the texture when homing ==\n;curr_bed_type={curr_bed_type}\n{if curr_bed_type=="Textured PEI Plate"}\nG29.1 Z{-0.04} ; for Textured PEI Plate\n{endif}\n;========turn off light and wait extrude temperature =============\nM1002 gcode_claim_action : 0\nM106 S0 ; turn off fan\nM106 P2 S0 ; turn off big fan\nM106 P3 S0 ; turn off chamber fan\n\nM975 S1 ; turn on mech mode supression\n
; machine_switch_extruder_time = 0
; machine_unload_filament_time = 28
; master_extruder_id = 1
; max_bridge_length = 0
; max_layer_height = 0.28
; max_travel_detour_distance = 0
; min_bead_width = 85%
; min_feature_size = 25%
; min_layer_height = 0.08
; minimum_sparse_infill_area = 15
; mmu_segmented_region_interlocking_depth = 0
; mmu_segmented_region_max_width = 0
; nozzle_diameter = 0.4
; nozzle_height = 4.2
; nozzle_temperature = 220
; nozzle_temperature_initial_layer = 220
; nozzle_temperature_range_high = 240
; nozzle_temperature_range_low = 190
; nozzle_type = stainless_steel
; nozzle_volume = 107
; nozzle_volume_type = Standard
; only_one_wall_first_layer = 0
; ooze_prevention = 0
; other_layers_print_sequence = 0
; other_layers_print_sequence_nums = 0
; outer_wall_acceleration = 5000
; outer_wall_jerk = 9
; outer_wall_line_width = 0.42
; outer_wall_speed = 200
; overhang_1_4_speed = 0
; overhang_2_4_speed = 50
; overhang_3_4_speed = 30
; overhang_4_4_speed = 10
; overhang_fan_speed = 100
; overhang_fan_threshold = 50%
; overhang_threshold_participating_cooling = 95%
; overhang_totally_speed = 10
; physical_extruder_map = 0
; post_process = 
; pre_start_fan_time = 0
; precise_z_height = 0
; pressure_advance = 0.02
; prime_tower_brim_width = 3
; prime_tower_enable_framework = 0
; prime_tower_extra_rib_length = 0
; prime_tower_fillet_wall = 1
; prime_tower_infill_gap = 150%
; prime_tower_lift_height = -1
; prime_tower_lift_speed = 90
; prime_tower_max_speed = 90
; prime_tower_rib_wall = 1
; prime_tower_rib_width = 8
; prime_tower_skip_points = 1
; prime_tower_width = 35
; print_compatible_printers = "Bambu Lab X1 Carbon 0.4 nozzle";"Bambu Lab X1 0.4 nozzle";"Bambu Lab P1S 0.4 nozzle";"Bambu Lab X1E 0.4 nozzle"
; print_extruder_id = 1
; print_extruder_variant = "Direct Drive Standard"
; print_flow_ratio = 1
; print_sequence = by layer
; print_settings_id = 0.20mm Standard @BBL X1C
; printable_area = 0x0,256x0,256x256,0x256
; printable_height = 250
; printer_extruder_id = 1
; printer_extruder_variant = "Direct Drive Standard"
; printer_model = Bambu Lab P1S
; printer_notes = 
; printer_settings_id = Bambu Lab P1S 0.4 nozzle
; printer_structure = corexy
; printer_technology = FFF
; printer_variant = 0.4
; printhost_authorization_type = key
; printhost_ssl_ignore_revoke = 0
; printing_by_object_gcode = 
; process_notes = 
; raft_contact_distance = 0.1
; raft_expansion = 1.5
; raft_first_layer_density = 90%
; raft_first_layer_expansion = 2
; raft_layers = 0
; reduce_crossing_wall = 0
; reduce_fan_stop_start_freq = 1
; reduce_infill_retraction = 1
; required_nozzle_HRC = 3
; resolution = 0.012
; retract_before_wipe = 0%
; retract_length_toolchange = 2
; retract_lift_above = 0
; retract_lift_below = 249
; retract_restart_extra = 0
; retract_restart_extra_toolchange = 0
; retract_when_changing_layer = 1
; retraction_distances_when_cut = 18
; retraction_length = 0.8
; retraction_minimum_travel = 1
; retraction_speed = 30
; role_base_wipe_speed = 1
; scan_first_layer = 0
; scarf_angle_threshold = 155
; seam_gap = 15%
; seam_position = aligned
; seam_slope_conditional = 1
; seam_slope_entire_loop = 0
; seam_slope_inner_walls = 1
; seam_slope_steps = 10
; silent_mode = 0
; single_extruder_multi_material = 1
; skirt_distance = 2
; skirt_height = 1
; skirt_loops = 0
; slice_closing_radius = 0.049
; slicing_mode = regular
; slow_down_for_layer_cooling = 1
; slow_down_layer_time = 4
; slow_down_min_speed = 20
; small_perimeter_speed = 50%
; small_perimeter_threshold = 0
; smooth_coefficient = 150
; smooth_speed_discontinuity_area = 1
; solid_infill_filament = 1
; sparse_infill_acceleration = 100%
; sparse_infill_anchor = 400%
; sparse_infill_anchor_max = 20
; sparse_infill_density = 15%
; sparse_infill_filament = 1
; sparse_infill_line_width = 0.45
; sparse_infill_pattern = grid
; sparse_infill_speed = 270
; spiral_mode = 0
; spiral_mode_max_xy_smoothing = 200%
; spiral_mode_smooth = 0
; standby_temperature_delta = -5
; start_end_points = 30x-3,54x245
; supertack_plate_temp = 45
; supertack_plate_temp_initial_layer = 45
; support_air_filtration = 0
; support_angle = 0
; support_base_pattern = default
; support_base_pattern_spacing = 2.5
; support_bottom_interface_spacing = 0.5
; support_bottom_z_distance = 0.2
; support_chamber_temp_control = 0
; support_critical_regions_only = 0
; support_expansion = 0
; support_filament = 0
; support_interface_bottom_layers = 2
; support_interface_filament = 0
; support_interface_loop_pattern = 0
; support_interface_not_for_body = 1
; support_interface_pattern = auto
; support_interface_spacing = 0.5
; support_interface_speed = 80
; support_interface_top_layers = 2
; support_line_width = 0.42
; support_object_first_layer_gap = 0.2
; support_object_xy_distance = 0.35
; support_on_build_plate_only = 0
; support_remove_small_overhang = 1
; support_speed = 150
; support_style = default
; support_threshold_angle = 30
; support_top_z_distance = 0.2
; support_type = tree(auto)
; symmetric_infill_y_axis = 0
; temperature_vitrification = 45
; template_custom_gcode = 
; textured_plate_temp = 55
; textured_plate_temp_initial_layer = 55
; thick_bridges = 0
; thumbnail_size = 50x50
; time_lapse_gcode = ;========Date 20250206========\n; SKIPPABLE_START\n; SKIPTYPE: timelapse\nM622.1 S1 ; for prev firware, default turned on\nM1002 judge_flag timelapse_record_flag\nM622 J1\n{if timelapse_type == 0} ; timelapse without wipe tower\nM971 S11 C10 O0\nM1004 S5 P1  ; external shutter\n{elsif timelapse_type == 1} ; timelapse with wipe tower\nG92 E0\nG1 X65 Y245 F20000 ; move to safe pos\nG17\nG2 Z{layer_z} I0.86 J0.86 P1 F20000\nG1 Y265 F3000\nM400\nM1004 S5 P1  ; external shutter\nM400 P300\nM971 S11 C11 O0\nG92 E0\nG1 X100 F5000\nG1 Y255 F20000\n{endif}\nM623\n; SKIPPABLE_END
; timelapse_type = 0
; top_area_threshold = 200%
; top_color_penetration_layers = 5
; top_one_wall_type = all top
; top_shell_layers = 5
; top_shell_thickness = 1
; top_solid_infill_flow_ratio = 1
; top_surface_acceleration = 2000
; top_surface_jerk = 9
; top_surface_line_width = 0.42
; top_surface_pattern = monotonicline
; top_surface_speed = 200
; travel_acceleration = 10000
; travel_jerk = 9
; travel_speed = 500
; travel_speed_z = 0
; tree_support_branch_angle = 45
; tree_support_branch_diameter = 2
; tree_support_branch_diameter_angle = 5
; tree_support_branch_distance = 5
; tree_support_wall_count = 0
; unprintable_filament_types = ""
; upward_compatible_machine = "Bambu Lab P1P 0.4 nozzle";"Bambu Lab X1 0.4 nozzle";"Bambu Lab X1 Carbon 0.4 nozzle";"Bambu Lab X1E 0.4 nozzle";"Bambu Lab A1 0.4 nozzle";"Bambu Lab H2D 0.4 nozzle"
; use_firmware_retraction = 0
; use_relative_e_distances = 1
; vertical_shell_speed = 80%
; wall_distribution_count = 1
; wall_filament = 1
; wall_generator = classic
; wall_loops = 2
; wall_sequence = inner wall/outer wall
; wall_transition_angle = 10
; wall_transition_filter_deviation = 25%
; wall_transition_length = 100%
; wipe = 1
; wipe_distance = 2
; wipe_speed = 80%
; wipe_tower_no_sparse_layers = 0
; wipe_tower_rotation_angle = 0
; wipe_tower_x = 165
; wipe_tower_y = 250
; xy_contour_compensation = 0
; xy_hole_compensation = 0
; z_direction_outwall_speed_continuous = 0
; z_hop = 0.4
; z_hop_types = Auto Lift
; CONFIG_BLOCK_END

; EXECUTABLE_BLOCK_START
M73 P0 R8
M201 X20000 Y20000 Z500 E5000
M203 X500 Y500 Z20 E30
M204 P20000 R5000 T20000
M205 X9.00 Y9.00 Z3.00 E2.50
M106 S0
M106 P2 S0
; FEATURE: Custom
;===== machine: P1S ========================
;===== date: 20231107 =====================
;===== turn on the HB fan & MC board fan =================
M104 S75 ;set extruder temp to turn on the HB fan and prevent filament oozing from nozzle
M710 A1 S255 ;turn on MC fan by default(P1S)
;===== reset machine status =================
M290 X40 Y40 Z2.6666666
G91
M17 Z0.4 ; lower the z-motor current
G380 S2 Z30 F300 ; G380 is same as G38; lower the hotbed , to prevent the nozzle is below the hotbed
G380 S2 Z-25 F300 ;
G1 Z5 F300;
G90
M17 X1.2 Y1.2 Z0.75 ; reset motor current to default
M960 S5 P1 ; turn on logo lamp
G90
M220 S100 ;Reset Feedrate
M221 S100 ;Reset Flowrate
M73.2   R1.0 ;Reset left time magnitude
M1002 set_gcode_claim_speed_level : 5
M221 X0 Y0 Z0 ; turn off soft endstop to prevent protential logic problem
G29.1 Z0 ; clear z-trim value first
M204 S10000 ; init ACC set to 10m/s^2

;===== heatbed preheat ====================
M1002 gcode_claim_action : 2
M140 S55 ;set bed temp
M190 S55 ;wait for bed temp



;=============turn on fans to prevent PLA jamming=================

    
    M106 P3 S180
    ;Prevent PLA from jamming

M106 P2 S100 ; turn on big fan ,to cool down toolhead

;===== prepare print temperature and material ==========
M104 S220 ;set extruder temp
G91
G0 Z10 F1200
G90
G28 X
M975 S1 ; turn on
G1 X60 F12000
G1 Y245
G1 Y265 F3000
M620 M
M620 S0A   ; switch material if AMS exist
    M109 S220
    G1 X120 F12000

    G1 X20 Y50 F12000
    G1 Y-3
    T0
    G1 X54 F12000
    G1 Y265
    M400
M621 S0A
M620.1 E F523.843 T240


M412 S1 ; ===turn on filament runout detection===

M109 S250 ;set nozzle to common flush temp
M106 P1 S0
G92 E0
M73 P6 R7
G1 E50 F200
M400
M104 S220
G92 E0
M73 P57 R3
G1 E50 F200
M400
M106 P1 S255
G92 E0
M73 P58 R3
G1 E5 F300
M109 S200 ; drop nozzle temp, make filament shink a bit
G92 E0
M73 P61 R3
G1 E-0.5 F300

M73 P64 R3
G1 X70 F9000
G1 X76 F15000
G1 X65 F15000
G1 X76 F15000
G1 X65 F15000; shake to put down garbage
G1 X80 F6000
G1 X95 F15000
G1 X80 F15000
G1 X165 F15000; wipe and shake
M400
M106 P1 S0
;===== prepare print temperature and material end =====


;===== wipe nozzle ===============================
M1002 gcode_claim_action : 14
M975 S1
M106 S255
G1 X65 Y230 F18000
G1 Y264 F6000
M109 S200
G1 X100 F18000 ; first wipe mouth

G0 X135 Y253 F20000  ; move to exposed steel surface edge
G28 Z P0 T300; home z with low precision,permit 300deg temperature
G29.2 S0 ; turn off ABL
G0 Z5 F20000

G1 X60 Y265
G92 E0
M73 P64 R2
G1 E-0.5 F300 ; retrack more
G1 X100 F5000; second wipe mouth
G1 X70 F15000
G1 X100 F5000
G1 X70 F15000
M73 P65 R2
G1 X100 F5000
G1 X70 F15000
G1 X100 F5000
G1 X70 F15000
G1 X90 F5000
G0 X128 Y261 Z-1.5 F20000  ; move to exposed steel surface and stop the nozzle
M104 S140 ; set temp down to heatbed acceptable
M106 S255 ; turn on fan (G28 has turn off fan)

M221 S; push soft endstop status
M221 Z0 ;turn off Z axis endstop
G0 Z0.5 F20000
G0 X125 Y259.5 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y262.5
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y260.0
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y262.0
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y260.5
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y261.5
G0 Z-1.01
G0 X131 F211
G0 X124
G0 Z0.5 F20000
G0 X125 Y261.0
G0 Z-1.01
G0 X131 F211
G0 X124
G0 X128
G2 I0.5 J0 F300
G2 I0.5 J0 F300
G2 I0.5 J0 F300
G2 I0.5 J0 F300

M109 S140 ; wait nozzle temp down to heatbed acceptable
G2 I0.5 J0 F3000
G2 I0.5 J0 F3000
G2 I0.5 J0 F3000
G2 I0.5 J0 F3000

M221 R; pop softend status
G1 Z10 F1200
M400
G1 Z10
M73 P66 R2
G1 F30000
G1 X230 Y15
G29.2 S1 ; turn on ABL
;G28 ; home again after hard wipe mouth
M106 S0 ; turn off fan , too noisy
;===== wipe nozzle end ================================


;===== bed leveling ==================================
M1002 judge_flag g29_before_print_flag
M622 J1

    M1002 gcode_claim_action : 1
    G29 A X123 Y123.737 I10 J8.52519
    M400
    M500 ; save cali data

M623
;===== bed leveling end ================================

;===== home after wipe mouth============================
M1002 judge_flag g29_before_print_flag
M622 J0

    M1002 gcode_claim_action : 13
    G28

M623
;===== home after wipe mouth end =======================

M975 S1 ; turn on vibration supression


;=============turn on fans to prevent PLA jamming=================

    
    M106 P3 S180
    ;Prevent PLA from jamming

M106 P2 S100 ; turn on big fan ,to cool down toolhead


M104 S220 ; set extrude temp earlier, to reduce wait time

;===== mech mode fast check============================
G1 X128 Y128 Z10 F20000
M400 P200
M970.3 Q1 A7 B30 C80  H15 K0
M974 Q1 S2 P0

G1 X128 Y128 Z10 F20000
M400 P200
M970.3 Q0 A7 B30 C90 Q0 H15 K0
M974 Q0 S2 P0

M975 S1
G1 F30000
M73 P67 R2
G1 X230 Y15
G28 X ; re-home XY
;===== fmech mode fast check============================


;===== nozzle load line ===============================
M975 S1
G90
M83
T1000
G1 X18.0 Y1.0 Z0.8 F18000;Move to start position
M109 S220
G1 Z0.2
G0 E2 F300
G0 X240 E15 F6033.27
G0 Y11 E0.700 F1508.32
G0 X239.5
G0 E0.2
G0 Y1.5 E0.700
G0 X18 E15 F6033.27
M400

;===== for Textured PEI Plate , lower the nozzle as the nozzle was touching topmost of the texture when homing ==
;curr_bed_type=Textured PEI Plate

G29.1 Z-0.04 ; for Textured PEI Plate

;========turn off light and wait extrude temperature =============
M1002 gcode_claim_action : 0
M106 S0 ; turn off fan
M106 P2 S0 ; turn off big fan
M106 P3 S0 ; turn off chamber fan

M975 S1 ; turn on mech mode supression
; MACHINE_START_GCODE_END
; filament start gcode
M106 P3 S150

M142 P1 R35 S40
;VT0
G90
G21
M83 ; use relative distances for extrusion
M981 S1 P20000 ;open spaghetti detector
; CHANGE_LAYER
; Z_HEIGHT: 0.2
; LAYER_HEIGHT: 0.2
G1 E-.8 F1800
; layer num/total_layer_count: 1/25
; update layer progress
M73 L1
M991 S0 P0 ;notify layer change
M106 S0
M106 P2 S0
M204 S6000
G1 Z.4 F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.801 Y128.523
G1 Z.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.5
G1 F2847
M204 S500
M73 P68 R2
G1 X128.404 Y128.62 E.01523
G3 X127.523 Y123.622 I-.444 J-2.498 E.29713
G1 X127.957 Y123.584 E.01623
G3 X128.854 Y128.496 I.003 J2.537 E.26296
M204 S6000
G1 X128.689 Y128.078 F30000
; FEATURE: Outer wall
M73 P69 R2
G1 F2847
M204 S500
G1 X128.673 Y128.075 E.00058
G3 X127.602 Y124.074 I-.713 J-1.953 E.25701
G1 X127.958 Y124.043 E.01328
G3 X129.001 Y127.922 I.003 J2.079 E.2028
G1 X128.743 Y128.051 E.01077
; WIPE_START
M73 P70 R2
G1 F3000
G1 X128.673 Y128.075 E-.02783
G1 X128.326 Y128.178 E-.13768
G1 X127.964 Y128.209 E-.138
G1 X127.602 Y128.178 E-.13803
G1 X127.251 Y128.084 E-.13799
M73 P71 R2
G1 X126.922 Y127.93 E-.138
G1 X126.831 Y127.866 E-.04247
; WIPE_END
G1 E-.04 F1800
M204 S6000
G1 X132.143 Y129.406 Z.6 F30000
G1 Z.2
G1 E.8 F1800
; FEATURE: Inner wall
G1 F2847
M204 S500
G1 X123.857 Y129.406 E.30862
G1 X123.857 Y122.594 E.25369
G1 X132.143 Y122.594 E.30862
G1 X132.143 Y129.346 E.25145
M204 S6000
G1 X132.6 Y129.863 F30000
; FEATURE: Outer wall
G1 F2847
M204 S500
M73 P72 R2
G1 X123.4 Y129.863 E.34267
G1 X123.4 Y122.137 E.28773
G1 X132.6 Y122.137 E.34267
G1 X132.6 Y129.803 E.2855
; WIPE_START
G1 F3000
G1 X130.6 Y129.816 E-.76
; WIPE_END
G1 E-.04 F1800
M204 S6000
G1 X129.14 Y128.632 Z.6 F30000
G1 Z.2
M73 P73 R2
G1 E.8 F1800
; FEATURE: Gap infill
; LINE_WIDTH: 0.493458
G1 F2847
M204 S500
G1 X128.996 Y128.946 E.01266
G1 X128.971 Y128.95 E.00095
; LINE_WIDTH: 0.476122
G1 X128.81 Y128.971 E.00573
; LINE_WIDTH: 0.433727
G1 X128.649 Y128.992 E.00517
; LINE_WIDTH: 0.387804
G3 X128.459 Y129.016 I-.366 J-2.159 E.00536
; LINE_WIDTH: 0.34424
G3 X127.44 Y129.013 I-.489 J-8.42 E.02504
; LINE_WIDTH: 0.391365
G1 X127.279 Y128.992 E.00461
; LINE_WIDTH: 0.433775
G1 X127.118 Y128.971 E.00517
; LINE_WIDTH: 0.476185
G1 X126.957 Y128.95 E.00574
; LINE_WIDTH: 0.493224
G1 X126.932 Y128.946 E.00095
G1 X126.788 Y128.633 E.01264
; WIPE_START
G1 F3000
G1 X126.932 Y128.946 E-.70713
G1 X126.957 Y128.95 E-.05287
; WIPE_END
G1 E-.04 F1800
M204 S6000
G1 X126.9 Y123.626 Z.6 F30000
G1 Z.2
G1 E.8 F1800
; FEATURE: Bottom surface
; LINE_WIDTH: 0.52388
G1 F2847
M204 S500
G1 X126.256 Y122.983 E.03566
G1 X125.576 Y122.983 E.02666
G1 X126.311 Y123.718 E.04072
G2 X125.936 Y124.023 I.679 J1.216 E.01904
G1 X124.896 Y122.983 E.05765
G1 X124.245 Y122.983 E.0255
G1 X124.245 Y123.013 E.00116
G1 X125.618 Y124.385 E.07605
G2 X125.357 Y124.805 I1.061 J.948 E.01946
G1 X124.245 Y123.693 E.06163
G1 X124.245 Y124.373 E.02666
G1 X125.164 Y125.291 E.0509
M73 P74 R2
G2 X125.055 Y125.863 I1.567 J.594 E.02291
G1 X124.245 Y125.053 E.04487
G1 X124.245 Y125.733 E.02666
G1 X125.07 Y126.557 E.04569
G1 X125.077 Y126.635 E.00305
G2 X125.427 Y127.594 I2.88 J-.507 E.04024
G1 X124.245 Y126.413 E.06546
G1 X124.245 Y127.094 E.02666
G1 X126.169 Y129.017 E.10661
G1 X125.489 Y129.017 E.02666
G1 X124.245 Y127.774 E.06891
G1 X124.245 Y128.454 E.02666
G1 X125.014 Y129.223 E.04261
; WIPE_START
G1 F6300
G1 X124.245 Y128.454 E-.41317
G1 X124.245 Y127.774 E-.25847
G1 X124.41 Y127.938 E-.08836
; WIPE_END
G1 E-.04 F1800
M204 S6000
G1 X127.224 Y123.12 Z.6 F30000
G1 Z.2
G1 E.8 F1800
; FEATURE: Gap infill
; LINE_WIDTH: 0.593661
G1 F2847
M204 S500
G3 X128.704 Y123.12 I.743 J8.898 E.06649
; WIPE_START
G1 F3000
G1 X127.979 Y123.089 E-.37249
G1 X127.224 Y123.12 E-.38751
; WIPE_END
G1 E-.04 F1800
M204 S6000
G1 X131.96 Y123.714 Z.6 F30000
G1 Z.2
G1 E.8 F1800
; FEATURE: Bottom surface
; LINE_WIDTH: 0.50598
G1 F2847
M204 S500
G1 X131.229 Y122.983 E.03901
G1 X130.574 Y122.983 E.02471
G1 X131.755 Y124.163 E.06298
G1 X131.755 Y124.818 E.02471
G1 X129.919 Y122.983 E.09792
G1 X129.265 Y122.983 E.02471
G1 X131.755 Y125.473 E.13287
G1 X131.755 Y126.128 E.02471
G1 X130.692 Y125.066 E.05668
G1 X130.851 Y125.615 E.02157
G1 X130.877 Y125.905 E.01099
G1 X131.755 Y126.783 E.04684
G1 X131.755 Y127.437 E.02471
G1 X130.86 Y126.542 E.04775
G1 X130.852 Y126.635 E.00351
G1 X130.734 Y127.072 E.01707
G1 X131.755 Y128.092 E.05444
G1 X131.755 Y128.747 E.02471
G1 X130.534 Y127.526 E.06514
G1 X130.273 Y127.921 E.01783
G1 X131.37 Y129.017 E.05851
G1 X130.715 Y129.017 E.02471
G1 X129.959 Y128.261 E.04032
G3 X129.712 Y128.468 I-.708 J-.598 E.0122
G1 X129.879 Y128.544 E.00694
G1 X129.787 Y128.745 E.00832
G1 X130.266 Y129.223 E.02552
; CHANGE_LAYER
; Z_HEIGHT: 0.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F6300
G1 X129.787 Y128.745 E-.25698
G1 X129.879 Y128.544 E-.08381
G1 X129.712 Y128.468 E-.06985
G1 X129.849 Y128.372 E-.06332
G1 X129.959 Y128.261 E-.05934
G1 X130.381 Y128.683 E-.22671
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 2/25
; update layer progress
M73 L2
M991 S0 P1 ;notify layer change
M106 S255
M106 P2 S178
; open powerlost recovery
M1003 S1
M204 S10000
G17
G3 Z.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.261
G1 Z.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3077
G1 X128.746 Y128.273 E.001
G3 X127.894 Y123.846 I-.774 J-2.147 E.26145
G3 X129.434 Y124.375 I.046 J2.371 E.05512
G3 X129.107 Y128.106 I-1.462 J1.752 E.14573
G1 X128.828 Y128.236 E.01022
G1 X128.611 Y127.902 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3077
M204 S5000
G3 X127.928 Y124.236 I-.639 J-1.777 E.20099
G3 X128.611 Y124.347 I-.032 J2.354 E.02134
G3 X128.667 Y127.881 I-.639 J1.777 E.14042
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.148
G1 X127.964 Y128.019 E-.12535
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12538
G1 X126.779 Y127.598 E-.11055
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z.8 F30000
G1 Z.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3077
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
M73 P75 R2
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3077
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.024 Y124.043 Z.8 F30000
G1 X125.624 Y123.543 Z.8
G1 Z.4
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.53452
G1 F3077
G1 X124.806 Y123.543 E.03279
G1 X124.806 Y124.663 E.04486
G1 X124.988 Y124.307 E.01601
G1 X125.349 Y123.818 E.02435
G1 X125.582 Y123.585 E.01318
G1 X127.384 Y123.124 F30000
; LINE_WIDTH: 0.42051
G1 F3077
G1 X127.433 Y123.112 E.00154
G2 X124.371 Y123.109 I-1.83 J241.122 E.09422
G1 X124.371 Y125.035 E.05927
; LINE_WIDTH: 0.436719
G1 X124.388 Y125.229 E.00627
; LINE_WIDTH: 0.470175
G1 X124.405 Y125.424 E.0068
; LINE_WIDTH: 0.509043
G3 X124.421 Y126.633 I-31.675 J1.043 E.04591
; LINE_WIDTH: 0.503632
G1 X124.405 Y126.828 E.00737
; LINE_WIDTH: 0.470175
G1 X124.388 Y127.024 E.00684
; LINE_WIDTH: 0.420494
G1 X124.371 Y127.22 E.00604
G1 X124.371 Y128.891 E.05143
G1 X126.686 Y128.891 E.07121
G1 X126.394 Y128.746 E.01002
G3 X125.118 Y127.233 I1.664 J-2.698 E.06195
; LINE_WIDTH: 0.44126
G1 X125.021 Y126.974 E.00896
; LINE_WIDTH: 0.496657
G1 X124.924 Y126.716 E.01021
G1 X124.869 Y126.179 E.01995
; LINE_WIDTH: 0.51088
G1 X124.898 Y125.64 E.02058
; LINE_WIDTH: 0.503632
G1 X124.958 Y125.469 E.00679
; LINE_WIDTH: 0.470175
G1 X125.018 Y125.298 E.0063
; LINE_WIDTH: 0.421375
G3 X125.963 Y123.818 I3.282 J1.055 E.05477
G3 X127.327 Y123.141 I2.168 J2.652 E.04736
G1 X127.433 Y123.112 F30000
; LINE_WIDTH: 0.423758
G1 F3077
G1 X128.483 Y123.113 E.03257
G1 X128.895 Y123.615 F30000
; LINE_WIDTH: 0.41999
G1 F3077
G3 X129.289 Y128.454 I-.949 J2.513 E.18627
; LINE_WIDTH: 0.434748
G1 X128.871 Y128.621 E.01438
; LINE_WIDTH: 0.467865
G1 X128.453 Y128.789 E.0156
G3 X127.476 Y128.785 I-.476 J-3.03 E.03396
; LINE_WIDTH: 0.45806
G1 X127.254 Y128.711 E.00791
; LINE_WIDTH: 0.420336
G3 X126.23 Y128.167 I1.012 J-3.142 E.03587
G1 X125.807 Y127.7 E.01937
G1 X125.456 Y127.064 E.02234
G1 X125.324 Y126.575 E.0156
G3 X127.903 Y123.454 I2.635 J-.449 E.14128
G1 X128.405 Y123.484 E.01549
G1 X128.837 Y123.599 E.01375
G1 X129.055 Y123.273 F30000
; LINE_WIDTH: 0.41999
G1 F3077
G3 X130.851 Y125.128 I-1.184 J2.943 E.0817
; LINE_WIDTH: 0.442727
G1 X130.916 Y125.298 E.00594
; LINE_WIDTH: 0.4882
G1 X130.982 Y125.468 E.00662
; LINE_WIDTH: 0.54006
G1 X131.048 Y125.638 E.00739
G3 X131.018 Y126.719 I-3.343 J.447 E.044
; LINE_WIDTH: 0.514357
G1 X130.951 Y126.885 E.00687
; LINE_WIDTH: 0.47661
G1 X130.884 Y127.051 E.00632
; LINE_WIDTH: 0.420503
G3 X130.272 Y128.127 I-3.723 J-1.406 E.03824
G3 X129.242 Y128.891 I-2.51 J-2.304 E.03969
G1 X131.629 Y128.891 E.07343
G1 X131.629 Y127.226 E.05123
; LINE_WIDTH: 0.443564
G1 X131.605 Y127.055 E.00564
; LINE_WIDTH: 0.49071
G1 X131.582 Y126.884 E.0063
; LINE_WIDTH: 0.546702
G1 X131.558 Y126.713 E.00709
G2 X131.561 Y125.616 I-13.836 J-.58 E.04506
; LINE_WIDTH: 0.533674
G1 X131.583 Y125.419 E.00792
; LINE_WIDTH: 0.4882
G1 X131.606 Y125.222 E.00719
; LINE_WIDTH: 0.422223
G1 X131.629 Y125.025 E.00612
G1 X131.629 Y123.109 E.05924
G2 X128.543 Y123.118 I-1.325 J75.145 E.0954
G1 X128.997 Y123.256 E.01469
G1 X130.333 Y123.555 F30000
; LINE_WIDTH: 0.55904
G1 F3077
G1 X130.701 Y123.944 E.02251
G1 X131.038 Y124.453 E.02566
G1 X131.182 Y124.762 E.01433
G1 X131.182 Y123.555 E.05074
G1 X130.393 Y123.555 E.03317
G1 X131.212 Y127.343 F30000
; LINE_WIDTH: 0.49868
G1 F3077
G1 X130.925 Y127.934 E.02441
G1 X130.512 Y128.475 E.02526
G1 X131.212 Y128.475 E.026
G1 X131.212 Y127.403 E.03981
G1 X128.001 Y129.246 F30000
; LINE_WIDTH: 0.471515
G1 F3077
G1 X128.512 Y129.239 E.01786
; LINE_WIDTH: 0.464263
G1 X128.774 Y129.254 E.009
; LINE_WIDTH: 0.420132
G1 X129.035 Y129.268 E.00806
G1 X132.006 Y129.268 E.0913
G1 X132.006 Y122.732 E.20093
G1 X123.994 Y122.732 E.24627
G1 X123.994 Y129.268 E.20093
G1 X126.982 Y129.268 E.09184
; LINE_WIDTH: 0.435735
G1 X127.238 Y129.253 E.0082
; LINE_WIDTH: 0.47121
G3 X127.941 Y129.245 I.398 J4.375 E.02457
G1 X124.775 Y127.45 F30000
; LINE_WIDTH: 0.47406
G1 F3077
G1 X124.775 Y128.487 E.03643
G1 X125.445 Y128.487 E.02354
G1 X125.055 Y127.987 E.0223
G1 X124.803 Y127.504 E.01915
; CHANGE_LAYER
; Z_HEIGHT: 0.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F14612.423
G1 X125.055 Y127.987 E-.20708
G1 X125.445 Y128.487 E-.24121
G1 X124.775 Y128.487 E-.25463
G1 X124.775 Y128.337 E-.05708
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 3/25
; update layer progress
M73 L3
M991 S0 P2 ;notify layer change
G17
G3 Z.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.261
G1 Z.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3076
G1 X128.746 Y128.274 E.001
G3 X127.882 Y123.847 I-.776 J-2.147 E.26118
G3 X129.715 Y124.656 I.094 J2.266 E.06885
G3 X129.108 Y128.107 I-1.745 J1.471 E.13248
G1 X128.828 Y128.236 E.01023
G1 X128.611 Y127.904 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3076
M204 S5000
G3 X127.917 Y124.237 I-.641 J-1.778 E.20085
G3 X128.91 Y124.487 I.062 J1.856 E.0319
G3 X128.667 Y127.883 I-.94 J1.64 E.13028
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14803
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12538
G1 X126.779 Y127.598 E-.11051
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z1 F30000
G1 Z.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3076
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3076
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
M73 P76 R2
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.024 Y124.043 Z1 F30000
G1 X125.624 Y123.543 Z1
G1 Z.6
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.53453
G1 F3076
G1 X124.806 Y123.543 E.03279
G1 X124.806 Y124.663 E.04486
G1 X124.988 Y124.307 E.01601
G1 X125.349 Y123.818 E.02435
G1 X125.582 Y123.585 E.01318
G1 X127.384 Y123.124 F30000
; LINE_WIDTH: 0.42051
G1 F3076
G1 X127.433 Y123.112 E.00154
G2 X124.371 Y123.109 I-1.829 J240.273 E.09422
G1 X124.371 Y125.035 E.05927
; LINE_WIDTH: 0.436717
G1 X124.388 Y125.23 E.00627
; LINE_WIDTH: 0.47017
G1 X124.405 Y125.424 E.00681
; LINE_WIDTH: 0.511943
G3 X124.428 Y126.742 I-52.268 J1.567 E.05036
; LINE_WIDTH: 0.513915
G1 X124.409 Y126.955 E.00821
; LINE_WIDTH: 0.476345
G1 X124.39 Y127.168 E.00755
; LINE_WIDTH: 0.420609
G1 X124.371 Y127.381 E.00658
G1 X124.371 Y128.891 E.04649
G1 X126.686 Y128.891 E.07123
G1 X126.394 Y128.746 E.01002
G3 X125.077 Y127.124 I1.569 J-2.62 E.06562
; LINE_WIDTH: 0.438775
G1 X125.023 Y126.987 E.00475
; LINE_WIDTH: 0.476345
G1 X124.97 Y126.85 E.0052
; LINE_WIDTH: 0.514349
G1 X124.916 Y126.713 E.00566
G3 X124.898 Y125.64 I3.895 J-.601 E.04136
; LINE_WIDTH: 0.503624
G1 X124.958 Y125.469 E.00679
; LINE_WIDTH: 0.47017
G1 X125.018 Y125.298 E.0063
; LINE_WIDTH: 0.421375
G3 X125.963 Y123.818 I3.282 J1.054 E.05477
G3 X127.327 Y123.141 I2.168 J2.651 E.04735
G1 X127.433 Y123.112 F30000
; LINE_WIDTH: 0.423635
G1 F3076
G1 X128.482 Y123.113 E.03255
G1 X127.89 Y123.455 F30000
; LINE_WIDTH: 0.41999
G1 F3076
G1 X128.404 Y123.484 E.01583
G1 X128.896 Y123.615 E.01561
G3 X129.289 Y128.454 I-.949 J2.513 E.18627
; LINE_WIDTH: 0.434743
G1 X128.871 Y128.621 E.01438
; LINE_WIDTH: 0.46786
G1 X128.453 Y128.789 E.0156
G3 X127.476 Y128.785 I-.476 J-3.031 E.03396
; LINE_WIDTH: 0.458075
G1 X127.254 Y128.711 E.00791
; LINE_WIDTH: 0.420383
G3 X126.23 Y128.167 I1.012 J-3.143 E.03587
G1 X125.807 Y127.7 E.01937
M73 P76 R1
G1 X125.636 Y127.451 E.0093
G3 X125.286 Y126.151 I2.651 J-1.411 E.04176
G1 X125.329 Y125.645 E.01563
G3 X127.83 Y123.46 I2.623 J.478 E.11028
G1 X129.055 Y123.273 F30000
; LINE_WIDTH: 0.41999
G1 F3076
G3 X130.851 Y125.128 I-1.184 J2.943 E.08169
; LINE_WIDTH: 0.442725
G1 X130.916 Y125.298 E.00594
; LINE_WIDTH: 0.488195
G1 X130.982 Y125.468 E.00662
; LINE_WIDTH: 0.540059
G1 X131.048 Y125.638 E.00739
G3 X131.018 Y126.719 I-3.345 J.447 E.044
; LINE_WIDTH: 0.514365
G1 X130.951 Y126.885 E.00687
; LINE_WIDTH: 0.476615
G1 X130.884 Y127.051 E.00632
; LINE_WIDTH: 0.420503
G3 X130.272 Y128.127 I-3.723 J-1.406 E.03824
G3 X129.242 Y128.891 I-2.51 J-2.304 E.03969
G1 X131.629 Y128.891 E.07343
G1 X131.629 Y127.226 E.05123
; LINE_WIDTH: 0.443564
G1 X131.605 Y127.055 E.00564
; LINE_WIDTH: 0.49071
G1 X131.582 Y126.884 E.0063
; LINE_WIDTH: 0.5467
G1 X131.558 Y126.713 E.00709
G2 X131.561 Y125.616 I-13.837 J-.58 E.04506
; LINE_WIDTH: 0.533665
G1 X131.583 Y125.419 E.00792
; LINE_WIDTH: 0.488195
G1 X131.606 Y125.222 E.00719
; LINE_WIDTH: 0.422214
G1 X131.629 Y125.025 E.00612
G1 X131.629 Y123.109 E.05924
G2 X128.542 Y123.118 I-1.324 J75.827 E.09541
G1 X128.997 Y123.256 E.0147
G1 X130.333 Y123.555 F30000
; LINE_WIDTH: 0.55904
G1 F3076
G1 X130.701 Y123.944 E.02251
G1 X131.038 Y124.453 E.02567
G1 X131.182 Y124.762 E.01432
G1 X131.182 Y123.555 E.05074
G1 X130.393 Y123.555 E.03317
G1 X131.212 Y127.343 F30000
; LINE_WIDTH: 0.49868
G1 F3076
G1 X130.925 Y127.934 E.02441
G1 X130.512 Y128.475 E.02526
G1 X131.212 Y128.475 E.026
G1 X131.212 Y127.403 E.03981
G1 X128.001 Y129.246 F30000
; LINE_WIDTH: 0.4715
G1 F3076
G1 X128.512 Y129.239 E.01786
; LINE_WIDTH: 0.464248
G1 X128.774 Y129.254 E.009
; LINE_WIDTH: 0.420132
G1 X129.035 Y129.268 E.00806
G1 X132.006 Y129.268 E.0913
G1 X132.006 Y122.732 E.20093
G1 X123.994 Y122.732 E.24627
G1 X123.994 Y129.268 E.20093
G1 X126.982 Y129.268 E.09184
; LINE_WIDTH: 0.435738
G1 X127.238 Y129.253 E.0082
; LINE_WIDTH: 0.471213
G3 X127.941 Y129.245 I.398 J4.372 E.02457
G1 X124.775 Y127.453 F30000
; LINE_WIDTH: 0.47405
G1 F3076
G1 X124.775 Y128.487 E.03635
G1 X125.445 Y128.487 E.02354
G1 X125.013 Y127.927 E.02486
G1 X124.802 Y127.506 E.01654
; CHANGE_LAYER
; Z_HEIGHT: 0.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F14612.763
G1 X125.013 Y127.927 E-.17888
G1 X125.445 Y128.487 E-.26887
G1 X124.775 Y128.487 E-.25463
G1 X124.775 Y128.336 E-.05762
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 4/25
; update layer progress
M73 L4
M991 S0 P3 ;notify layer change
G17
G3 Z1 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1941
G1 X128.36 Y128.371 E.0122
G3 X126.279 Y127.662 I-.396 J-2.245 E.0761
G3 X127.871 Y123.848 I1.675 J-1.54 E.17191
G3 X128.772 Y128.258 I.093 J2.278 E.21332
G1 X128.611 Y127.904 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1941
M204 S5000
G3 X127.905 Y124.238 I-.639 J-1.778 E.20037
G3 X128.91 Y124.487 I.076 J1.851 E.03225
G3 X128.667 Y127.883 I-.938 J1.64 E.13032
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14802
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12537
G1 X127.018 Y127.765 E-.12537
G1 X126.779 Y127.598 E-.11052
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z1.2 F30000
G1 Z.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1941
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1941
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z1.2 F30000
G1 Z.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1941
G1 X124.688 Y129.312 E.05401
G1 X126.062 Y127.938 E.06449
G2 X129.902 Y127.902 I1.903 J-1.817 E.14275
G1 X131.312 Y129.312 E.06617
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X127.84 Y123.501 I-1.77 J1.785 E.07063
G2 X126.188 Y124.188 I.139 J2.662 E.06053
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 1
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
M73 P77 R1
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 5/25
; update layer progress
M73 L5
M991 S0 P4 ;notify layer change
G17
G3 Z1.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.261
G1 Z1
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1945
G1 X128.746 Y128.275 E.001
G3 X127.859 Y123.849 I-.776 J-2.146 E.26041
G3 X129.944 Y124.983 I.094 J2.31 E.08268
G3 X129.108 Y128.107 I-1.974 J1.146 E.11922
G1 X128.828 Y128.236 E.01023
G1 X128.611 Y127.904 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1945
M204 S5000
G3 X127.893 Y124.239 I-.641 J-1.777 E.20006
G3 X129.181 Y124.676 I.055 J1.954 E.04266
G3 X128.667 Y127.883 I-1.21 J1.451 E.12011
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14802
G1 X127.964 Y128.019 E-.12535
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12537
G1 X127.018 Y127.765 E-.12537
G1 X126.779 Y127.598 E-.11053
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z1.4 F30000
G1 Z1
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1945
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1945
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.228 Y124.779 Z1.4 F30000
G1 X123.95 Y123.579 Z1.4
G1 Z1
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1945
G1 X123.95 Y122.688 E.02955
G1 X124.688 Y122.688 E.02446
G1 X126.188 Y124.188 E.07039
G3 X129.776 Y124.224 I1.775 J1.925 E.1311
G1 X131.312 Y122.688 E.07208
G1 X132.05 Y122.688 E.02446
G1 X132.05 Y129.312 E.21975
G1 X131.312 Y129.312 E.02446
G1 X129.902 Y127.902 E.06617
G1 X129.754 Y128.049 E.00691
G3 X126.062 Y127.938 I-1.791 J-1.891 E.1362
G1 X124.688 Y129.312 E.06449
G1 X126.316 Y129.312 E.05401
; CHANGE_LAYER
; Z_HEIGHT: 1.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X124.688 Y129.312 E-.61876
G1 X124.951 Y129.049 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 6/25
; update layer progress
M73 L6
M991 S0 P5 ;notify layer change
G17
G3 Z1.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z1.2
M73 P78 R1
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1941
G1 X128.36 Y128.369 E.0122
G3 X126.296 Y127.678 I-.397 J-2.244 E.07528
G3 X127.847 Y123.85 I1.657 J-1.557 E.17189
G3 X128.771 Y128.256 I.116 J2.276 E.21391
G1 X128.612 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1941
M204 S5000
G3 X127.881 Y124.24 I-.64 J-1.778 E.19971
G3 X129.181 Y124.676 I.07 J1.947 E.04302
G3 X128.668 Y127.884 I-1.209 J1.452 E.12015
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14804
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11051
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z1.6 F30000
G1 Z1.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1941
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1941
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z1.6 F30000
G1 Z1.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1941
G1 X124.688 Y129.312 E.05401
G1 X126.062 Y127.938 E.06449
G2 X129.902 Y127.902 I1.903 J-1.785 E.14312
G1 X131.312 Y129.312 E.06617
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X126.188 Y124.188 I-1.813 J1.891 E.13109
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 1.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 7/25
; update layer progress
M73 L7
M991 S0 P6 ;notify layer change
G17
G3 Z1.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z1.4
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1947
G1 X128.361 Y128.377 E.01222
G3 X127.836 Y123.851 I-.39 J-2.248 E.24634
G3 X129.944 Y124.983 I.12 J2.306 E.08345
G3 X128.774 Y128.265 I-1.973 J1.146 E.13151
G1 X128.612 Y127.906 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1947
M204 S5000
G3 X127.87 Y124.242 I-.64 J-1.778 E.1993
G3 X129.181 Y124.676 I.084 J1.942 E.04338
G3 X128.668 Y127.884 I-1.209 J1.452 E.12017
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14806
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
M73 P79 R1
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z1.8 F30000
G1 Z1.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1947
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1947
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.228 Y124.779 Z1.8 F30000
G1 X123.95 Y123.579 Z1.8
G1 Z1.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1947
G1 X123.95 Y122.688 E.02955
G1 X124.688 Y122.688 E.02446
G1 X126.188 Y124.188 E.07039
G3 X127.805 Y123.504 I1.786 J1.968 E.05936
G3 X129.776 Y124.224 I.203 J2.501 E.0718
G1 X131.312 Y122.688 E.07208
G1 X132.05 Y122.688 E.02446
G1 X132.05 Y129.312 E.21975
G1 X131.312 Y129.312 E.02446
G1 X129.902 Y127.902 E.06617
G3 X126.062 Y127.938 I-1.936 J-1.749 E.14312
G1 X124.688 Y129.312 E.06449
G1 X126.316 Y129.312 E.05401
; CHANGE_LAYER
; Z_HEIGHT: 1.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X124.688 Y129.312 E-.61876
G1 X124.951 Y129.049 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 8/25
; update layer progress
M73 L8
M991 S0 P7 ;notify layer change
G17
G3 Z1.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z1.6
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1940
G1 X128.361 Y128.377 E.01222
G3 X127.824 Y123.852 I-.39 J-2.248 E.24593
G3 X129.944 Y124.983 I.133 J2.303 E.08383
G3 X128.774 Y128.265 I-1.973 J1.146 E.13151
G1 X128.612 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1940
M204 S5000
G3 X127.858 Y124.243 I-.641 J-1.777 E.199
G3 X129.414 Y124.909 I.119 J1.87 E.05396
G3 X128.668 Y127.884 I-1.443 J1.219 E.10996
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14806
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
M73 P80 R1
G1 X132.398 Y129.661 Z2 F30000
G1 Z1.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1940
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1940
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z2 F30000
G1 Z1.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1940
G1 X124.688 Y129.312 E.05401
G1 X126.062 Y127.938 E.06449
G2 X129.902 Y127.902 I1.903 J-1.785 E.14312
G1 X131.312 Y129.312 E.06618
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X127.794 Y123.505 I-1.768 J1.78 E.07218
G2 X126.188 Y124.188 I.18 J2.65 E.05897
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 1.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 9/25
; update layer progress
M73 L9
M991 S0 P8 ;notify layer change
G17
G3 Z2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.261
G1 Z1.8
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1945
G1 X128.743 Y128.266 E.00102
G3 X126.32 Y127.703 I-.779 J-2.14 E.08727
G3 X127.812 Y123.853 I1.63 J-1.582 E.17186
G3 X129.103 Y128.098 I.151 J2.273 E.20284
G1 X128.827 Y128.235 E.01021
G1 X128.612 Y127.906 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1945
M204 S5000
G3 X127.846 Y124.244 I-.641 J-1.777 E.19863
G3 X129.414 Y124.909 I.131 J1.869 E.05432
G3 X128.668 Y127.884 I-1.443 J1.219 E.10997
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14805
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12537
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z2.2 F30000
G1 Z1.8
M73 P81 R1
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1945
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1945
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.228 Y124.779 Z2.2 F30000
G1 X123.95 Y123.579 Z2.2
G1 Z1.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1945
G1 X123.95 Y122.688 E.02955
G1 X124.688 Y122.688 E.02446
G1 X126.188 Y124.188 E.07039
G3 X129.776 Y124.224 I1.775 J1.93 E.13106
G1 X131.312 Y122.688 E.07208
G1 X132.05 Y122.688 E.02446
G1 X132.05 Y129.312 E.21975
G1 X131.312 Y129.312 E.02446
G1 X129.902 Y127.902 E.06617
G3 X126.062 Y127.938 I-1.936 J-1.781 E.14276
G1 X124.688 Y129.312 E.06449
G1 X126.316 Y129.312 E.05401
; CHANGE_LAYER
; Z_HEIGHT: 2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X124.688 Y129.312 E-.61876
G1 X124.951 Y129.049 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 10/25
; update layer progress
M73 L10
M991 S0 P9 ;notify layer change
G17
G3 Z2.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.261
G1 Z2
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1937
G1 X128.745 Y128.273 E.001
G3 X127.801 Y123.854 I-.784 J-2.143 E.25896
G3 X130.043 Y125.195 I.189 J2.23 E.09256
G3 X129.106 Y128.104 I-2.081 J.935 E.11106
G1 X128.827 Y128.236 E.01022
G1 X128.612 Y127.906 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1937
M204 S5000
G3 X127.835 Y124.245 I-.641 J-1.777 E.19824
G3 X129.414 Y124.909 I.143 J1.867 E.05468
G3 X128.668 Y127.884 I-1.443 J1.219 E.10997
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14805
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z2.4 F30000
G1 Z2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1937
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1937
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z2.4 F30000
M73 P82 R1
G1 Z2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1937
G1 X124.688 Y129.312 E.05401
G1 X126.082 Y127.958 E.06449
G2 X129.902 Y127.902 I1.883 J-1.837 E.1418
G1 X131.312 Y129.312 E.06617
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X126.188 Y124.188 I-1.813 J1.895 E.13105
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 2.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 11/25
; update layer progress
M73 L11
M991 S0 P10 ;notify layer change
G17
G3 Z2.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z2.2
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1947
G1 X128.361 Y128.376 E.01222
G3 X127.789 Y123.855 I-.399 J-2.246 E.24533
G3 X130.038 Y125.185 I.201 J2.228 E.09256
G3 X128.773 Y128.262 I-2.076 J.945 E.12368
G1 X128.612 Y127.906 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1947
M204 S5000
G3 X127.823 Y124.246 I-.64 J-1.777 E.19786
G3 X129.414 Y124.909 I.155 J1.866 E.05504
G3 X128.668 Y127.884 I-1.443 J1.219 E.10997
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14806
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z2.6 F30000
G1 Z2.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1947
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1947
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.228 Y124.779 Z2.6 F30000
G1 X123.95 Y123.579 Z2.6
G1 Z2.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1947
G1 X123.95 Y122.688 E.02955
G1 X124.688 Y122.688 E.02446
G1 X126.188 Y124.188 E.07039
G3 X129.776 Y124.224 I1.775 J1.933 E.13104
G1 X131.312 Y122.688 E.07208
G1 X132.05 Y122.688 E.02446
G1 X132.05 Y129.312 E.21975
G1 X131.312 Y129.312 E.02446
G1 X129.902 Y127.902 E.06618
G1 X129.804 Y127.999 E.00457
G3 X126.062 Y127.938 I-1.841 J-1.875 E.13816
G1 X124.688 Y129.312 E.06449
G1 X126.316 Y129.312 E.05401
; CHANGE_LAYER
; Z_HEIGHT: 2.4
; LAYER_HEIGHT: 0.2
; WIPE_START
M73 P83 R1
G1 F15476.087
G1 X124.688 Y129.312 E-.61876
G1 X124.951 Y129.049 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 12/25
; update layer progress
M73 L12
M991 S0 P11 ;notify layer change
G17
G3 Z2.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z2.4
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1939
G1 X128.361 Y128.376 E.01222
G3 X127.777 Y123.856 I-.399 J-2.246 E.24494
G3 X130.033 Y125.174 I.212 J2.226 E.09255
G3 X128.773 Y128.262 I-2.071 J.956 E.12407
G1 X128.612 Y127.906 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1939
M204 S5000
G3 X127.811 Y124.247 I-.64 J-1.777 E.19748
G3 X129.414 Y124.909 I.167 J1.865 E.0554
G3 X128.668 Y127.884 I-1.443 J1.219 E.10997
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14806
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12538
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z2.8 F30000
G1 Z2.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1939
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1939
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z2.8 F30000
G1 Z2.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1939
G1 X124.688 Y129.312 E.05401
G1 X126.062 Y127.938 E.06449
G1 X126.099 Y127.974 E.00172
G2 X129.902 Y127.902 I1.867 J-1.82 E.14138
G1 X131.312 Y129.312 E.06617
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X126.188 Y124.188 I-1.813 J1.898 E.13103
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 2.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 13/25
; update layer progress
M73 L13
M991 S0 P12 ;notify layer change
G17
G3 Z2.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z2.6
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1947
M73 P84 R1
G1 X128.361 Y128.376 E.01222
G3 X127.766 Y123.857 I-.399 J-2.246 E.24455
G3 X130.028 Y125.163 I.224 J2.224 E.09256
G3 X128.773 Y128.262 I-2.067 J.967 E.12446
G1 X128.612 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1947
M204 S5000
G3 X127.8 Y124.248 I-.64 J-1.777 E.19712
G3 X129.414 Y124.909 I.179 J1.864 E.05576
G3 X128.668 Y127.884 I-1.442 J1.219 E.10997
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14806
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z3 F30000
G1 Z2.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1947
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1947
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.228 Y124.779 Z3 F30000
G1 X123.95 Y123.579 Z3
G1 Z2.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1947
G1 X123.95 Y122.688 E.02955
G1 X124.688 Y122.688 E.02446
G1 X126.188 Y124.188 E.07039
G3 X127.735 Y123.51 I1.782 J1.963 E.05702
G3 X129.776 Y124.224 I.271 J2.499 E.07413
G1 X131.312 Y122.688 E.07208
G1 X132.05 Y122.688 E.02446
G1 X132.05 Y129.312 E.21975
G1 X131.312 Y129.312 E.02446
G1 X129.902 Y127.902 E.06618
G3 X126.062 Y127.938 I-1.936 J-1.749 E.14312
G1 X124.688 Y129.312 E.06449
G1 X126.316 Y129.312 E.05401
; CHANGE_LAYER
; Z_HEIGHT: 2.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X124.688 Y129.312 E-.61876
G1 X124.951 Y129.049 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 14/25
; update layer progress
M73 L14
M991 S0 P13 ;notify layer change
G17
G3 Z3 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.261
G1 Z2.8
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1938
G1 X128.746 Y128.275 E.001
G3 X127.754 Y123.858 I-.776 J-2.146 E.25685
G3 X130.112 Y125.344 I.222 J2.262 E.09954
G3 X129.108 Y128.107 I-2.142 J.785 E.10597
G1 X128.828 Y128.236 E.01024
G1 X128.612 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1938
M204 S5000
G3 X127.788 Y124.249 I-.64 J-1.777 E.19676
G3 X129.414 Y124.909 I.19 J1.863 E.05612
G3 X128.668 Y127.884 I-1.443 J1.219 E.10997
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14805
G1 X127.964 Y128.019 E-.12536
M73 P85 R1
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z3.2 F30000
G1 Z2.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1938
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1938
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z3.2 F30000
G1 Z2.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1938
G1 X124.688 Y129.312 E.05401
G1 X126.062 Y127.938 E.06449
G2 X129.902 Y127.902 I1.903 J-1.785 E.14312
G1 X131.312 Y129.312 E.06617
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X126.188 Y124.188 I-1.813 J1.899 E.13101
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 3
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 15/25
; update layer progress
M73 L15
M991 S0 P14 ;notify layer change
G17
G3 Z3.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.262
G1 Z3
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1945
G1 X128.744 Y128.27 E.001
G3 X127.567 Y123.874 I-.78 J-2.146 E.2512
G1 X127.742 Y123.859 E.00583
G1 X127.964 Y123.84 E.00739
G3 X129.105 Y128.102 I0 J2.284 E.19838
G1 X128.827 Y128.236 E.01022
G1 X128.612 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1945
M204 S5000
G3 X127.776 Y124.25 I-.641 J-1.777 E.19642
G3 X129.414 Y124.909 I.201 J1.863 E.05648
G3 X128.668 Y127.884 I-1.443 J1.219 E.10997
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14806
G1 X127.964 Y128.019 E-.12535
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12538
G1 X126.78 Y127.598 E-.11049
; WIPE_END
M73 P86 R1
G1 E-.04 F1800
G1 X132.398 Y129.661 Z3.4 F30000
G1 Z3
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1945
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1945
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.228 Y124.779 Z3.4 F30000
G1 X123.95 Y123.579 Z3.4
G1 Z3
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1945
G1 X123.95 Y122.688 E.02955
G1 X124.688 Y122.688 E.02446
G1 X126.188 Y124.188 E.07039
G3 X129.776 Y124.224 I1.774 J1.936 E.13101
G1 X131.312 Y122.688 E.07208
G1 X132.05 Y122.688 E.02446
G1 X132.05 Y129.312 E.21975
G1 X131.312 Y129.312 E.02446
G1 X129.902 Y127.902 E.06618
G3 X126.062 Y127.938 I-1.936 J-1.781 E.14276
G1 X124.688 Y129.312 E.06449
G1 X126.316 Y129.312 E.05401
; CHANGE_LAYER
; Z_HEIGHT: 3.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X124.688 Y129.312 E-.61876
G1 X124.951 Y129.049 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 16/25
; update layer progress
M73 L16
M991 S0 P15 ;notify layer change
G17
G3 Z3.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z3.2
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1941
G1 X128.36 Y128.373 E.01221
G3 X127.567 Y123.874 I-.396 J-2.249 E.23799
G1 X127.73 Y123.86 E.00544
G1 X127.964 Y123.84 E.00778
G3 X128.773 Y128.26 I0 J2.284 E.2106
G1 X128.612 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1941
M204 S5000
G3 X127.765 Y124.251 I-.641 J-1.777 E.19609
G3 X129.414 Y124.909 I.212 J1.862 E.05685
G3 X128.668 Y127.884 I-1.443 J1.219 E.10996
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14805
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12537
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z3.6 F30000
G1 Z3.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
M73 P87 R1
G1 F1941
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1941
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z3.6 F30000
G1 Z3.2
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1941
G1 X124.688 Y129.312 E.05401
G1 X126.062 Y127.938 E.06449
G2 X129.902 Y127.902 I1.903 J-1.817 E.14275
G1 X131.312 Y129.312 E.06618
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X126.188 Y124.188 I-1.813 J1.901 E.131
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 3.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 17/25
; update layer progress
M73 L17
M991 S0 P16 ;notify layer change
G17
G3 Z3.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.262
G1 Z3.4
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1946
G1 X128.745 Y128.272 E.00099
G3 X127.567 Y123.874 I-.781 J-2.147 E.25134
G1 X127.719 Y123.861 E.00505
G1 X127.964 Y123.84 E.00817
G3 X129.106 Y128.104 I0 J2.285 E.19846
G1 X128.827 Y128.236 E.01023
G1 X128.612 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1946
M204 S5000
G3 X127.753 Y124.252 I-.641 J-1.777 E.19576
G3 X129.414 Y124.909 I.223 J1.862 E.05721
G3 X128.668 Y127.884 I-1.443 J1.219 E.10995
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14806
G1 X127.964 Y128.019 E-.12535
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11049
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z3.8 F30000
G1 Z3.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1946
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1946
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
M73 P88 R1
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.228 Y124.779 Z3.8 F30000
G1 X123.95 Y123.579 Z3.8
G1 Z3.4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1946
G1 X123.95 Y122.688 E.02955
G1 X124.688 Y122.688 E.02446
G1 X126.188 Y124.188 E.07039
G3 X127.688 Y123.514 I1.785 J1.967 E.05547
G3 X129.776 Y124.224 I.312 J2.505 E.07569
G1 X131.312 Y122.688 E.07208
G1 X132.05 Y122.688 E.02446
G1 X132.05 Y129.312 E.21975
G1 X131.312 Y129.312 E.02446
G1 X129.902 Y127.902 E.06618
G3 X126.062 Y127.938 I-1.936 J-1.749 E.14312
G1 X124.688 Y129.312 E.06449
G1 X126.316 Y129.312 E.05401
; CHANGE_LAYER
; Z_HEIGHT: 3.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X124.688 Y129.312 E-.61876
G1 X124.951 Y129.049 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 18/25
; update layer progress
M73 L18
M991 S0 P17 ;notify layer change
G17
G3 Z3.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z3.6
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1941
G1 X128.359 Y128.369 E.0122
G3 X127.567 Y123.874 I-.396 J-2.247 E.23778
G1 X127.707 Y123.862 E.00467
G1 X127.964 Y123.84 E.00855
G3 X128.771 Y128.256 I0 J2.282 E.21043
G1 X128.612 Y127.906 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1941
M204 S5000
M73 P88 R0
G3 X127.741 Y124.253 I-.64 J-1.778 E.19537
G3 X129.181 Y124.676 I.217 J1.922 E.04734
G3 X128.668 Y127.885 I-1.209 J1.452 E.12018
; WIPE_START
G1 F12000
M204 S10000
G1 X128.293 Y127.99 E-.14806
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12538
G1 X126.78 Y127.598 E-.11048
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z4 F30000
G1 Z3.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1941
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1941
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z4 F30000
G1 Z3.6
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1941
G1 X124.688 Y129.312 E.05401
G1 X126.062 Y127.938 E.06449
G2 X129.902 Y127.902 I1.903 J-1.785 E.14312
G1 X131.312 Y129.312 E.06617
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X127.677 Y123.515 I-1.777 J1.798 E.07607
G2 X126.188 Y124.188 I.298 J2.642 E.05508
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 3.8
; LAYER_HEIGHT: 0.2
; WIPE_START
M73 P89 R0
G1 F15476.087
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 19/25
; update layer progress
M73 L19
M991 S0 P18 ;notify layer change
G17
G3 Z4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.262
G1 Z3.8
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1945
G1 X128.743 Y128.266 E.00101
G3 X127.567 Y123.874 I-.779 J-2.145 E.25095
G1 X127.695 Y123.863 E.00428
G1 X127.964 Y123.84 E.00894
G3 X129.103 Y128.099 I0 J2.282 E.19822
G1 X128.827 Y128.235 E.01021
G1 X128.611 Y127.904 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1945
M204 S5000
G1 X128.292 Y127.987 E.01012
G3 X127.73 Y124.254 I-.321 J-1.861 E.18472
G3 X129.181 Y124.676 I.227 J1.923 E.0477
G3 X128.666 Y127.882 I-1.209 J1.45 E.12012
; WIPE_START
G1 F12000
M204 S10000
G1 X128.292 Y127.987 E-.14734
G1 X127.964 Y128.019 E-.12527
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12537
G1 X127.018 Y127.765 E-.12537
G1 X126.778 Y127.597 E-.11129
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z4.2 F30000
G1 Z3.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1945
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1945
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.228 Y124.779 Z4.2 F30000
G1 X123.95 Y123.579 Z4.2
G1 Z3.8
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1945
G1 X123.95 Y122.688 E.02955
G1 X124.688 Y122.688 E.02446
G1 X126.188 Y124.188 E.07039
G3 X127.665 Y123.516 I1.789 J1.972 E.05469
G3 X129.776 Y124.224 I.332 J2.509 E.07646
G1 X131.312 Y122.688 E.07208
G1 X132.05 Y122.688 E.02446
G1 X132.05 Y129.312 E.21975
G1 X131.312 Y129.312 E.02446
G1 X129.902 Y127.902 E.06617
G3 X126.062 Y127.938 I-1.936 J-1.749 E.14312
G1 X124.688 Y129.312 E.06449
G1 X126.316 Y129.312 E.05401
; CHANGE_LAYER
; Z_HEIGHT: 4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X124.688 Y129.312 E-.61876
G1 X124.951 Y129.049 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 20/25
; update layer progress
M73 L20
M991 S0 P19 ;notify layer change
G17
G3 Z4.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.262
G1 Z4
G1 E.8 F1800
; FEATURE: Inner wall
G1 F1937
G1 X128.743 Y128.267 E.001
G3 X127.567 Y123.874 I-.78 J-2.145 E.25103
G1 X127.684 Y123.864 E.00388
G1 X127.964 Y123.84 E.00933
G3 X129.104 Y128.1 I0 J2.283 E.19828
G1 X128.827 Y128.235 E.01022
G1 X128.612 Y127.904 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
M73 P90 R0
G1 F1937
M204 S5000
G1 X128.611 Y127.902 E.00007
G3 X127.718 Y124.255 I-.639 J-1.776 E.1945
G3 X129.181 Y124.676 I.238 J1.924 E.04806
G3 X128.91 Y127.764 I-1.21 J1.45 E.11173
G1 X128.666 Y127.879 E.00828
; WIPE_START
G1 F12000
M204 S10000
G1 X128.611 Y127.902 E-.02288
G1 X128.293 Y127.99 E-.1253
G1 X127.964 Y128.019 E-.12535
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12537
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.598 E-.11037
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z4.4 F30000
G1 Z4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F1937
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F1937
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.316 Y129.312 Z4.4 F30000
G1 Z4
G1 E.8 F1800
; FEATURE: Sparse infill
; LINE_WIDTH: 0.45
G1 F1937
G1 X124.688 Y129.312 E.05401
G1 X126.062 Y127.938 E.06449
G2 X129.902 Y127.902 I1.903 J-1.817 E.14276
G1 X131.312 Y129.312 E.06617
G1 X132.05 Y129.312 E.02446
G1 X132.05 Y122.688 E.21975
G1 X131.312 Y122.688 E.02446
G1 X129.776 Y124.224 E.07208
G2 X126.188 Y124.188 I-1.813 J1.904 E.13097
G1 X124.688 Y122.688 E.07039
G1 X123.95 Y122.688 E.02446
G1 X123.95 Y123.579 E.02955
; CHANGE_LAYER
; Z_HEIGHT: 4.2
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F15476.087
G1 X123.95 Y122.688 E-.33854
G1 X124.688 Y122.688 E-.28022
G1 X124.951 Y122.951 E-.14124
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 21/25
; update layer progress
M73 L21
M991 S0 P20 ;notify layer change
G17
G3 Z4.4 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.262
G1 Z4.2
G1 E.8 F1800
; FEATURE: Inner wall
G1 F3235
G1 X128.743 Y128.266 E.00101
G3 X127.567 Y123.874 I-.779 J-2.145 E.25096
G1 X127.672 Y123.865 E.0035
G1 X127.964 Y123.84 E.00972
G3 X129.103 Y128.099 I0 J2.282 E.19821
G1 X128.827 Y128.235 E.01022
G1 X128.612 Y127.904 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3235
M204 S5000
G1 X128.611 Y127.904 E.00002
G3 X127.706 Y124.256 I-.64 J-1.778 E.19427
G3 X128.91 Y124.487 I.271 J1.842 E.03839
G3 X128.911 Y127.766 I-.939 J1.64 E.12199
G1 X128.666 Y127.879 E.00828
; WIPE_START
G1 F12000
M204 S10000
M73 P91 R0
G1 X128.611 Y127.904 E-.02299
G1 X128.293 Y127.99 E-.12537
G1 X127.964 Y128.019 E-.12535
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.78 Y127.599 E-.11019
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z4.6 F30000
G1 Z4.2
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3235
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3235
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X125.579 Y124.428 Z4.6 F30000
G1 X123.994 Y122.732 Z4.6
G1 Z4.2
G1 E.8 F1800
; Slow Down Start
; FEATURE: Floating vertical shell
; LINE_WIDTH: 0.41999
G1 F3000;_EXTRUDE_SET_SPEED
G1 X132.006 Y122.732 E.24617
G1 X132.006 Y129.268 E.20086
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.434743
;_EXTRUDE_SET_SPEED
G1 X130.521 Y129.268 E.04742
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.458442
;_EXTRUDE_SET_SPEED
G1 X129.035 Y129.268 E.05029
G1 X128.512 Y129.239 E.01775
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.48098
;_EXTRUDE_SET_SPEED
G1 X128.001 Y129.246 E.01825
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.446758
;_EXTRUDE_SET_SPEED
G2 X126.982 Y129.268 I-.372 J6.351 E.03358
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.41999
;_EXTRUDE_SET_SPEED
G1 X123.994 Y129.268 E.0918
G1 X123.994 Y122.792 E.19901
; Slow Down End
G1 X126.255 Y124.064 F30000
; Slow Down Start
; LINE_WIDTH: 0.419989
G1 F3000;_EXTRUDE_SET_SPEED
G3 X129.289 Y128.454 I1.701 J2.068 E.27226
G1 X128.453 Y128.789 E.02768
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.471448
;_EXTRUDE_SET_SPEED
G3 X127.476 Y128.785 I-.476 J-3.031 E.03425
G1 X127.033 Y128.637 E.01634
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.41999
;_EXTRUDE_SET_SPEED
G3 X126.23 Y128.167 I.93 J-2.51 E.02873
G1 X125.807 Y127.7 E.01935
G1 X125.636 Y127.451 E.00929
G3 X126.212 Y124.106 I2.322 J-1.322 E.113
; Slow Down End
G1 X127.433 Y123.112 F30000
; LINE_WIDTH: 0.407019
G1 F3235
G3 X128.386 Y123.107 I.51 J5.575 E.0283
G1 X131.629 Y123.813 F30000
; Slow Down Start
; LINE_WIDTH: 0.442725
G1 F3000;_EXTRUDE_SET_SPEED
G1 X131.629 Y124.217 E.01316
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.488195
;_EXTRUDE_SET_SPEED
G1 X131.629 Y124.621 E.01466
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.500947
;_EXTRUDE_SET_SPEED
G3 X131.561 Y125.616 I-4.34 J.202 E.03729
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.55892
;_EXTRUDE_SET_SPEED
G1 X131.57 Y126.202 E.02465
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.517865
;_EXTRUDE_SET_SPEED
G1 X131.566 Y126.372 E.0066
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.478715
;_EXTRUDE_SET_SPEED
G1 X131.562 Y126.543 E.00605
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.478058
;_EXTRUDE_SET_SPEED
G1 X131.558 Y126.713 E.00604
G1 X131.629 Y127.226 E.01837
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.41999
;_EXTRUDE_SET_SPEED
G1 X131.629 Y128.891 E.05116
G1 X129.242 Y128.891 E.07333
G1 X129.448 Y128.795 E.00698
G2 X130.584 Y127.696 I-1.751 J-2.945 E.04902
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.438867
;_EXTRUDE_SET_SPEED
G1 X130.662 Y127.536 E.00573
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.47662
;_EXTRUDE_SET_SPEED
G1 X130.739 Y127.376 E.00627
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.487583
;_EXTRUDE_SET_SPEED
G2 X131.018 Y126.719 I-4.626 J-2.347 E.02587
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.532479
;_EXTRUDE_SET_SPEED
G2 X131.048 Y125.638 I-3.313 J-.634 E.04333
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.533665
;_EXTRUDE_SET_SPEED
G1 X131.033 Y125.604 E.00148
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.488195
;_EXTRUDE_SET_SPEED
G1 X131.018 Y125.57 E.00135
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.460212
;_EXTRUDE_SET_SPEED
G3 X130.817 Y125.035 I4.296 J-1.92 E.01945
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.420079
;_EXTRUDE_SET_SPEED
G2 X128.446 Y123.109 I-2.858 J1.096 E.0983
G3 X131.629 Y123.109 I1.864 J1469.001 E.09782
G1 X131.629 Y123.753 E.01981
; Slow Down End
G1 X127.433 Y123.112 F30000
; Slow Down Start
; LINE_WIDTH: 0.420692
G1 F3000;_EXTRUDE_SET_SPEED
G2 X125.344 Y124.556 I.632 J3.148 E.08038
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.43563
;_EXTRUDE_SET_SPEED
G1 X125.227 Y124.796 E.00852
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.46691
;_EXTRUDE_SET_SPEED
G1 X125.111 Y125.035 E.0092
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.44034
;_EXTRUDE_SET_SPEED
G1 X125.023 Y125.287 E.00864
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.48104
;_EXTRUDE_SET_SPEED
M73 P92 R0
G1 X124.935 Y125.539 E.00953
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.50145
;_EXTRUDE_SET_SPEED
G1 X124.869 Y126.073 E.0201
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.48104
;_EXTRUDE_SET_SPEED
G1 X124.884 Y126.342 E.00963
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.460264
;_EXTRUDE_SET_SPEED
G1 X124.898 Y126.612 E.00918
G1 X125.077 Y127.124 E.01846
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.41999
;_EXTRUDE_SET_SPEED
G2 X126.686 Y128.891 I2.951 J-1.07 E.07532
G1 X124.371 Y128.891 E.07112
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.436717
;_EXTRUDE_SET_SPEED
G1 X124.371 Y128.333 E.01791
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.47017
;_EXTRUDE_SET_SPEED
G1 X124.371 Y127.775 E.01943
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.48122
;_EXTRUDE_SET_SPEED
G3 X124.421 Y126.633 I6.676 J-.279 E.04089
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.52035
;_EXTRUDE_SET_SPEED
G1 X124.411 Y126.126 E.01972
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.479855
;_EXTRUDE_SET_SPEED
G1 X124.416 Y125.872 E.00903
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.461048
;_EXTRUDE_SET_SPEED
G2 X124.371 Y125.035 I-3.96 J-.207 E.02864
; Slow Down End
; Slow Down Start
; LINE_WIDTH: 0.422296
;_EXTRUDE_SET_SPEED
G1 X124.371 Y123.109 E.05954
G3 X127.373 Y123.112 I1.233 J236.849 E.09281
; Slow Down End
G1 X131.182 Y123.813 F30000
; Slow Down Start
; LINE_WIDTH: 0.55904
G1 F3000;_EXTRUDE_SET_SPEED
G1 X131.182 Y124.762 E.03989
G1 X131.038 Y124.453 E.01432
G1 X130.701 Y123.944 E.02567
G1 X130.333 Y123.555 E.02251
G1 X131.182 Y123.555 E.0357
G1 X131.182 Y123.753 E.00833
; Slow Down End
G1 X125.624 Y123.543 F30000
; Slow Down Start
; LINE_WIDTH: 0.53452
G1 F3000;_EXTRUDE_SET_SPEED
G1 X125.349 Y123.818 E.01558
G1 X124.988 Y124.307 E.02435
G1 X124.806 Y124.663 E.01601
G1 X124.806 Y123.543 E.04486
G1 X125.564 Y123.543 E.03039
; Slow Down End
G1 X124.775 Y127.453 F30000
; Slow Down Start
; LINE_WIDTH: 0.47406
G1 F3000;_EXTRUDE_SET_SPEED
G1 X125.013 Y127.927 E.01865
G1 X125.445 Y128.487 E.02486
G1 X124.775 Y128.487 E.02354
G1 X124.775 Y127.513 E.03424
; Slow Down End
G1 X130.512 Y128.475 F30000
; Slow Down Start
; LINE_WIDTH: 0.49867
G1 F3000;_EXTRUDE_SET_SPEED
G1 X130.925 Y127.934 E.02526
G1 X131.212 Y127.343 E.02442
G1 X131.212 Y128.475 E.04204
G1 X130.572 Y128.475 E.02377
; Slow Down End
; CHANGE_LAYER
; Z_HEIGHT: 4.4
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F3000
G1 X131.212 Y128.475 E-.2432
G1 X131.212 Y127.343 E-.43013
G1 X131.113 Y127.548 E-.08668
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 22/25
; update layer progress
M73 L22
M991 S0 P21 ;notify layer change
G17
G3 Z4.6 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.717 Y128.282
G1 Z4.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3105
G1 X128.36 Y128.371 E.01221
G3 X127.567 Y123.874 I-.396 J-2.248 E.23789
G1 X127.66 Y123.866 E.00311
G1 X127.964 Y123.84 E.01011
G3 X128.772 Y128.258 I0 J2.283 E.21051
G1 X128.611 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3105
M204 S5000
G1 X128.292 Y127.985 E.01011
G3 X127.635 Y124.262 I-.328 J-1.862 E.18246
G1 X127.695 Y124.257 E.00182
G1 X127.964 Y124.233 E.00831
G3 X128.662 Y127.88 I0 J1.89 E.16051
; WIPE_START
G1 F12000
M204 S10000
G1 X128.292 Y127.985 E-.14604
G1 X127.964 Y128.019 E-.12521
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12536
G1 X127.018 Y127.765 E-.12537
G1 X126.775 Y127.595 E-.11266
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z4.8 F30000
G1 Z4.4
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3105
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3105
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.024 Y124.043 Z4.8 F30000
G1 X125.624 Y123.543 Z4.8
G1 Z4.4
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.53453
G1 F3105
G1 X124.806 Y123.543 E.03279
G1 X124.806 Y124.663 E.04486
G1 X124.988 Y124.307 E.01601
G1 X125.349 Y123.818 E.02435
G1 X125.582 Y123.585 E.01318
G1 X127.433 Y123.112 F30000
; LINE_WIDTH: 0.420443
G1 F3105
G2 X124.371 Y123.109 I-1.83 J242.385 E.0942
G1 X124.371 Y125.035 E.05925
; LINE_WIDTH: 0.436717
G1 X124.388 Y125.229 E.00627
; LINE_WIDTH: 0.47017
G1 X124.405 Y125.424 E.00681
; LINE_WIDTH: 0.509037
G3 X124.421 Y126.633 I-31.672 J1.043 E.04591
; LINE_WIDTH: 0.503624
G1 X124.405 Y126.828 E.00734
; LINE_WIDTH: 0.47017
G1 X124.388 Y127.022 E.0068
; LINE_WIDTH: 0.420483
G1 X124.371 Y127.217 E.00601
G1 X124.371 Y128.891 E.05151
G1 X126.686 Y128.891 E.07121
G1 X126.394 Y128.746 E.01002
G3 X125.077 Y127.124 I1.57 J-2.62 E.06561
; LINE_WIDTH: 0.436717
G1 X125.018 Y126.953 E.0058
; LINE_WIDTH: 0.47017
G1 X124.958 Y126.783 E.0063
; LINE_WIDTH: 0.50175
G1 X124.898 Y126.612 E.00676
G3 X124.935 Y125.539 I3.064 J-.432 E.04034
; LINE_WIDTH: 0.46691
G1 X125.023 Y125.287 E.00922
; LINE_WIDTH: 0.421714
G3 X127.375 Y123.128 I3.005 J.914 E.10338
G1 X127.433 Y123.112 F30000
; LINE_WIDTH: 0.402943
G1 F3105
G3 X128.386 Y123.107 I.51 J5.575 E.02798
G1 X128.895 Y123.615 F30000
; LINE_WIDTH: 0.41999
G1 F3105
G3 X129.289 Y128.454 I-.949 J2.513 E.18627
; LINE_WIDTH: 0.434743
G1 X128.871 Y128.621 E.01438
; LINE_WIDTH: 0.467857
G1 X128.453 Y128.789 E.0156
G3 X127.476 Y128.785 I-.476 J-3.031 E.03396
; LINE_WIDTH: 0.45806
G1 X127.254 Y128.711 E.00791
; LINE_WIDTH: 0.420335
G3 X126.23 Y128.167 I1.012 J-3.142 E.03586
G1 X125.807 Y127.7 E.01937
G1 X125.636 Y127.451 E.00929
G3 X128.838 Y123.599 I2.325 J-1.324 E.1993
G1 X128.962 Y123.239 F30000
; LINE_WIDTH: 0.41999
G1 F3105
G3 X130.817 Y125.035 I-1.088 J2.979 E.0817
; LINE_WIDTH: 0.440705
G1 X130.91 Y125.286 E.00867
; LINE_WIDTH: 0.482135
G1 X131.003 Y125.536 E.00957
; LINE_WIDTH: 0.516238
G1 X131.026 Y125.587 E.00215
; LINE_WIDTH: 0.541223
G1 X131.048 Y125.638 E.00226
G3 X131.018 Y126.719 I-3.344 J.447 E.0441
; LINE_WIDTH: 0.514357
G1 X130.951 Y126.885 E.00687
; LINE_WIDTH: 0.47661
G1 X130.884 Y127.051 E.00632
; LINE_WIDTH: 0.420503
G3 X130.272 Y128.127 I-3.724 J-1.407 E.03824
G3 X129.242 Y128.891 I-2.509 J-2.303 E.03969
G1 X131.629 Y128.891 E.07343
G1 X131.629 Y127.226 E.05123
; LINE_WIDTH: 0.443564
G1 X131.605 Y127.055 E.00564
; LINE_WIDTH: 0.49071
G1 X131.582 Y126.884 E.0063
; LINE_WIDTH: 0.5467
G1 X131.558 Y126.713 E.00709
G2 X131.561 Y125.616 I-13.835 J-.58 E.04505
; LINE_WIDTH: 0.533665
G1 X131.583 Y125.419 E.00793
; LINE_WIDTH: 0.488195
G1 X131.606 Y125.222 E.00719
; LINE_WIDTH: 0.420873
G1 X131.629 Y125.025 E.0061
G1 X131.629 Y123.109 E.05903
G2 X128.446 Y123.109 I-1.319 J1469.01 E.09803
G1 X128.904 Y123.225 E.01455
G1 X130.333 Y123.555 F30000
; LINE_WIDTH: 0.55903
G1 F3105
G1 X130.701 Y123.944 E.02251
G1 X131.038 Y124.453 E.02566
G1 X131.182 Y124.762 E.01434
G1 X131.182 Y123.555 E.05074
G1 X130.393 Y123.555 E.03317
G1 X131.212 Y127.343 F30000
; LINE_WIDTH: 0.49868
G1 F3105
G1 X130.925 Y127.934 E.02442
G1 X130.512 Y128.475 E.02526
G1 X131.212 Y128.475 E.026
G1 X131.212 Y127.403 E.03981
G1 X128.001 Y129.246 F30000
; LINE_WIDTH: 0.4715
G1 F3105
G1 X128.512 Y129.239 E.01786
; LINE_WIDTH: 0.464248
G1 X128.774 Y129.254 E.009
; LINE_WIDTH: 0.420132
G1 X129.035 Y129.268 E.00806
M73 P93 R0
G1 X132.006 Y129.268 E.0913
G1 X132.006 Y122.732 E.20093
G1 X123.994 Y122.732 E.24627
G1 X123.994 Y129.268 E.20093
G1 X126.982 Y129.268 E.09183
; LINE_WIDTH: 0.435735
G1 X127.238 Y129.253 E.0082
; LINE_WIDTH: 0.471206
G3 X127.941 Y129.245 I.398 J4.375 E.02457
G1 X124.775 Y127.453 F30000
; LINE_WIDTH: 0.47404
G1 F3105
G1 X124.775 Y128.487 E.03635
G1 X125.445 Y128.487 E.02354
G1 X125.013 Y127.927 E.02486
G1 X124.802 Y127.506 E.01654
; CHANGE_LAYER
; Z_HEIGHT: 4.6
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F14613.101
G1 X125.013 Y127.927 E-.17891
G1 X125.445 Y128.487 E-.26887
G1 X124.775 Y128.487 E-.25465
G1 X124.775 Y128.336 E-.05758
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 23/25
; update layer progress
M73 L23
M991 S0 P22 ;notify layer change
G17
G3 Z4.8 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.262
G1 Z4.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3075
G1 X128.743 Y128.266 E.00101
G3 X127.567 Y123.874 I-.779 J-2.145 E.25095
G1 X127.649 Y123.867 E.00272
G1 X127.964 Y123.84 E.0105
G3 X129.103 Y128.099 I0 J2.282 E.19822
G1 X128.827 Y128.235 E.01022
G1 X128.612 Y127.904 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3075
M204 S5000
G1 X128.609 Y127.898 E.00022
G3 X127.635 Y124.262 I-.645 J-1.775 E.19244
G1 X127.683 Y124.258 E.00147
G1 X127.964 Y124.233 E.00867
G3 X128.907 Y127.759 I0 J1.889 E.152
G1 X128.666 Y127.878 E.00826
; WIPE_START
G1 F12000
M204 S10000
G1 X128.609 Y127.898 E-.02296
G1 X128.293 Y127.99 E-.12516
G1 X127.964 Y128.019 E-.12536
G1 X127.635 Y127.99 E-.12535
G1 X127.317 Y127.904 E-.12538
G1 X127.018 Y127.765 E-.12535
G1 X126.78 Y127.598 E-.11045
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z5 F30000
G1 Z4.6
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3075
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3075
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.024 Y124.043 Z5 F30000
G1 X125.624 Y123.543 Z5
G1 Z4.6
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.53453
G1 F3075
G1 X124.806 Y123.543 E.03279
G1 X124.806 Y124.663 E.04486
G1 X124.988 Y124.307 E.01601
G1 X125.349 Y123.818 E.02436
G1 X125.582 Y123.585 E.01317
G1 X127.518 Y123.109 F30000
; LINE_WIDTH: 0.419997
G1 F3075
G1 X124.371 Y123.109 E.09671
G1 X124.371 Y125.035 E.05919
; LINE_WIDTH: 0.436719
G1 X124.388 Y125.23 E.00627
; LINE_WIDTH: 0.470175
G1 X124.405 Y125.424 E.0068
; LINE_WIDTH: 0.509043
G3 X124.421 Y126.633 I-31.67 J1.043 E.04591
; LINE_WIDTH: 0.503632
G1 X124.405 Y126.828 E.00734
; LINE_WIDTH: 0.470175
G1 X124.388 Y127.022 E.0068
; LINE_WIDTH: 0.420483
G1 X124.371 Y127.217 E.00601
G1 X124.371 Y128.891 E.05152
G1 X126.686 Y128.891 E.07121
G1 X126.394 Y128.746 E.01002
G3 X125.077 Y127.124 I1.57 J-2.62 E.06561
; LINE_WIDTH: 0.436719
G1 X125.018 Y126.953 E.0058
; LINE_WIDTH: 0.470175
G1 X124.958 Y126.783 E.0063
; LINE_WIDTH: 0.501758
G1 X124.898 Y126.612 E.00676
G3 X124.935 Y125.539 I3.064 J-.432 E.04035
; LINE_WIDTH: 0.466925
G1 X125.023 Y125.287 E.00922
; LINE_WIDTH: 0.421213
G3 X126.985 Y123.234 I3.009 J.911 E.09083
G1 X127.459 Y123.118 E.01505
G1 X127.518 Y123.109 F30000
; LINE_WIDTH: 0.42064
G1 F3075
G1 X128.386 Y123.109 E.0267
G1 X128.895 Y123.615 F30000
; LINE_WIDTH: 0.41999
G1 F3075
G3 X129.289 Y128.454 I-.949 J2.513 E.18626
; LINE_WIDTH: 0.434748
G1 X128.871 Y128.621 E.01438
; LINE_WIDTH: 0.467865
G1 X128.453 Y128.789 E.0156
G3 X127.476 Y128.785 I-.476 J-3.03 E.03396
; LINE_WIDTH: 0.45806
G1 X127.254 Y128.711 E.00791
; LINE_WIDTH: 0.420335
G3 X126.23 Y128.167 I1.012 J-3.142 E.03587
G1 X125.807 Y127.7 E.01937
G1 X125.636 Y127.451 E.00929
G3 X127.573 Y123.482 I2.341 J-1.314 E.15945
G3 X128.838 Y123.599 I.378 J2.825 E.03939
G1 X128.962 Y123.239 F30000
; LINE_WIDTH: 0.41999
G1 F3075
G3 X130.817 Y125.035 I-1.088 J2.979 E.0817
; LINE_WIDTH: 0.44072
G1 X130.91 Y125.286 E.00867
; LINE_WIDTH: 0.48218
G1 X131.003 Y125.536 E.00957
; LINE_WIDTH: 0.516285
G1 X131.026 Y125.587 E.00215
; LINE_WIDTH: 0.541222
G1 X131.048 Y125.638 E.00226
G3 X131.018 Y126.719 I-3.343 J.447 E.04411
; LINE_WIDTH: 0.51434
G1 X130.948 Y126.891 E.00712
; LINE_WIDTH: 0.4766
G1 X130.878 Y127.063 E.00655
; LINE_WIDTH: 0.420523
G3 X130.272 Y128.127 I-4.225 J-1.705 E.0378
G3 X129.242 Y128.891 I-2.51 J-2.303 E.03969
G1 X131.629 Y128.891 E.07343
G1 X131.629 Y127.23 E.05113
; LINE_WIDTH: 0.443564
G1 X131.605 Y127.057 E.00567
; LINE_WIDTH: 0.49071
G1 X131.582 Y126.885 E.00634
; LINE_WIDTH: 0.546695
G1 X131.558 Y126.713 E.00713
G2 X131.561 Y125.616 I-13.836 J-.58 E.04505
; LINE_WIDTH: 0.533674
G1 X131.583 Y125.419 E.00792
; LINE_WIDTH: 0.4882
G1 X131.606 Y125.222 E.00719
; LINE_WIDTH: 0.420873
G1 X131.629 Y125.025 E.0061
G1 X131.629 Y123.109 E.05904
G2 X128.446 Y123.109 I-1.319 J1469.057 E.09803
G1 X128.904 Y123.225 E.01455
G1 X130.333 Y123.555 F30000
; LINE_WIDTH: 0.55904
G1 F3075
G1 X130.701 Y123.944 E.02251
G1 X131.038 Y124.453 E.02566
G1 X131.182 Y124.762 E.01433
G1 X131.182 Y123.555 E.05074
G1 X130.393 Y123.555 E.03317
G1 X131.212 Y127.339 F30000
; LINE_WIDTH: 0.49867
G1 F3075
G1 X130.949 Y127.882 E.0224
G1 X130.512 Y128.475 E.02736
G1 X131.212 Y128.475 E.026
G1 X131.212 Y127.399 E.03996
G1 X128.001 Y129.246 F30000
; LINE_WIDTH: 0.471515
G1 F3075
G1 X128.512 Y129.239 E.01786
; LINE_WIDTH: 0.464263
G1 X128.774 Y129.254 E.009
; LINE_WIDTH: 0.420132
G1 X129.035 Y129.268 E.00806
G1 X132.006 Y129.268 E.0913
G1 X132.006 Y122.732 E.20093
G1 X123.994 Y122.732 E.24627
G1 X123.994 Y129.268 E.20093
G1 X126.982 Y129.268 E.09184
; LINE_WIDTH: 0.435733
G1 X127.238 Y129.253 E.0082
; LINE_WIDTH: 0.471204
G3 X127.941 Y129.245 I.398 J4.372 E.02457
G1 X124.775 Y127.453 F30000
; LINE_WIDTH: 0.47405
G1 F3075
G1 X124.775 Y128.487 E.03635
G1 X125.445 Y128.487 E.02354
G1 X125.013 Y127.927 E.02486
G1 X124.802 Y127.506 E.01654
; CHANGE_LAYER
; Z_HEIGHT: 4.8
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F14612.763
G1 X125.013 Y127.927 E-.17891
G1 X125.445 Y128.487 E-.26884
G1 X124.775 Y128.487 E-.25463
G1 X124.775 Y128.336 E-.05762
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 24/25
; update layer progress
M73 L24
M991 S0 P23 ;notify layer change
G17
G3 Z5 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.773 Y128.262
M73 P94 R0
G1 Z4.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3075
G1 X128.743 Y128.267 E.00101
G3 X127.567 Y123.874 I-.777 J-2.145 E.2508
G1 X127.637 Y123.868 E.00233
G3 X129.944 Y127.269 I.32 J2.266 E.16926
G1 X129.904 Y127.326 E.00233
G3 X129.103 Y128.099 I-1.938 J-1.205 E.03728
G1 X128.827 Y128.235 E.01022
G1 X128.611 Y127.905 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3075
M204 S5000
G1 X128.292 Y127.986 E.0101
G3 X127.635 Y124.262 I-.328 J-1.862 E.18251
G1 X127.671 Y124.259 E.00111
G1 X127.964 Y124.233 E.00903
G3 X128.663 Y127.881 I0 J1.891 E.16053
; WIPE_START
G1 F12000
M204 S10000
G1 X128.292 Y127.986 E-.14649
G1 X127.964 Y128.019 E-.12524
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.12538
G1 X127.018 Y127.765 E-.12535
G1 X126.776 Y127.596 E-.11219
; WIPE_END
G1 E-.04 F1800
G1 X132.398 Y129.661 Z5.2 F30000
G1 Z4.8
G1 E.8 F1800
; FEATURE: Inner wall
; LINE_WIDTH: 0.45
G1 F3075
G1 X123.602 Y129.661 E.29178
G1 X123.602 Y122.339 E.24285
G1 X132.398 Y122.339 E.29178
G1 X132.398 Y129.601 E.24086
G1 X132.79 Y130.053 F30000
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3075
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X126.024 Y124.043 Z5.2 F30000
G1 X125.624 Y123.543 Z5.2
G1 Z4.8
G1 E.8 F1800
; FEATURE: Internal solid infill
; LINE_WIDTH: 0.53452
G1 F3075
G1 X124.806 Y123.543 E.03279
G1 X124.806 Y124.663 E.04486
G1 X124.988 Y124.307 E.01601
G1 X125.349 Y123.818 E.02436
G1 X125.582 Y123.585 E.01317
G1 X127.506 Y123.109 F30000
; LINE_WIDTH: 0.420054
G1 F3075
G2 X124.371 Y123.109 I-1.837 J1481.776 E.09635
G1 X124.371 Y125.035 E.05919
; LINE_WIDTH: 0.436719
G1 X124.388 Y125.229 E.00627
; LINE_WIDTH: 0.470175
G1 X124.405 Y125.424 E.00681
; LINE_WIDTH: 0.509042
G3 X124.421 Y126.633 I-31.671 J1.043 E.04592
; LINE_WIDTH: 0.503632
G1 X124.405 Y126.828 E.00734
; LINE_WIDTH: 0.470175
G1 X124.388 Y127.022 E.0068
; LINE_WIDTH: 0.420483
G1 X124.371 Y127.217 E.00601
G1 X124.371 Y128.891 E.05152
G1 X126.686 Y128.891 E.07121
G1 X126.394 Y128.746 E.01002
G3 X125.077 Y127.124 I1.57 J-2.62 E.06561
; LINE_WIDTH: 0.436719
G1 X125.018 Y126.953 E.0058
; LINE_WIDTH: 0.470175
G1 X124.958 Y126.783 E.0063
; LINE_WIDTH: 0.501758
G1 X124.898 Y126.612 E.00676
G3 X124.935 Y125.539 I3.065 J-.432 E.04035
; LINE_WIDTH: 0.466903
G1 X125.023 Y125.287 E.00922
; LINE_WIDTH: 0.421285
G3 X126.983 Y123.235 I3.009 J.912 E.09077
G1 X127.447 Y123.119 E.01477
G1 X127.506 Y123.109 F30000
; LINE_WIDTH: 0.402192
G1 F3075
G3 X128.386 Y123.107 I.456 J5.402 E.02577
G1 X128.896 Y123.615 F30000
; LINE_WIDTH: 0.41999
G1 F3075
G3 X129.289 Y128.454 I-.949 J2.513 E.18626
; LINE_WIDTH: 0.434745
G1 X128.871 Y128.621 E.01438
; LINE_WIDTH: 0.467859
G1 X128.453 Y128.789 E.0156
G3 X127.476 Y128.785 I-.476 J-3.031 E.03396
; LINE_WIDTH: 0.458053
G1 X127.254 Y128.711 E.00791
; LINE_WIDTH: 0.420335
G3 X126.23 Y128.167 I1.012 J-3.142 E.03587
G1 X125.807 Y127.7 E.01937
G1 X125.636 Y127.451 E.00929
G3 X127.56 Y123.484 I2.342 J-1.314 E.15907
G3 X128.838 Y123.599 I.388 J2.833 E.03979
G1 X128.962 Y123.239 F30000
; LINE_WIDTH: 0.41999
G1 F3075
G3 X130.817 Y125.035 I-1.088 J2.979 E.0817
; LINE_WIDTH: 0.440713
G1 X130.91 Y125.286 E.00867
; LINE_WIDTH: 0.482158
G1 X131.003 Y125.536 E.00957
; LINE_WIDTH: 0.51626
G1 X131.026 Y125.587 E.00215
; LINE_WIDTH: 0.541229
G1 X131.048 Y125.638 E.00226
G3 X131.018 Y126.719 I-3.344 J.447 E.04411
; LINE_WIDTH: 0.514374
G1 X130.948 Y126.89 E.00709
; LINE_WIDTH: 0.47662
G1 X130.879 Y127.061 E.00652
; LINE_WIDTH: 0.420521
G3 X130.272 Y128.127 I-4.158 J-1.665 E.03785
G3 X129.242 Y128.891 I-2.51 J-2.304 E.03969
G1 X131.629 Y128.891 E.07343
G1 X131.629 Y127.229 E.05115
; LINE_WIDTH: 0.443565
G1 X131.605 Y127.057 E.00567
; LINE_WIDTH: 0.490715
G1 X131.582 Y126.885 E.00634
; LINE_WIDTH: 0.546697
G1 X131.558 Y126.713 E.00713
G2 X131.561 Y125.616 I-13.829 J-.58 E.04505
; LINE_WIDTH: 0.533665
G1 X131.583 Y125.419 E.00792
; LINE_WIDTH: 0.488195
G1 X131.606 Y125.222 E.00719
; LINE_WIDTH: 0.420871
G1 X131.629 Y125.025 E.0061
G1 X131.629 Y123.109 E.05903
G2 X128.446 Y123.109 I-1.319 J1469.481 E.09803
G1 X128.904 Y123.225 E.01456
G1 X130.333 Y123.555 F30000
; LINE_WIDTH: 0.55903
G1 F3075
G1 X130.701 Y123.944 E.02251
G1 X131.038 Y124.453 E.02566
G1 X131.182 Y124.762 E.01433
G1 X131.182 Y123.555 E.05074
G1 X130.393 Y123.555 E.03317
G1 X131.212 Y127.339 F30000
; LINE_WIDTH: 0.49867
G1 F3075
G3 X130.512 Y128.475 I-3.743 J-1.524 E.04977
G1 X131.212 Y128.475 E.026
G1 X131.212 Y127.399 E.03994
G1 X128.001 Y129.246 F30000
; LINE_WIDTH: 0.471505
G1 F3075
G1 X128.512 Y129.239 E.01786
; LINE_WIDTH: 0.464255
G1 X128.774 Y129.254 E.009
; LINE_WIDTH: 0.420132
G1 X129.035 Y129.268 E.00806
G1 X132.006 Y129.268 E.0913
G1 X132.006 Y122.732 E.20093
G1 X123.994 Y122.732 E.24626
G1 X123.994 Y129.268 E.20093
G1 X126.982 Y129.268 E.09183
; LINE_WIDTH: 0.435733
G1 X127.238 Y129.253 E.0082
; LINE_WIDTH: 0.4712
G3 X127.941 Y129.245 I.398 J4.376 E.02457
G1 X124.775 Y127.453 F30000
; LINE_WIDTH: 0.47406
G1 F3075
G1 X124.775 Y128.487 E.03635
G1 X125.445 Y128.487 E.02354
G1 X125.013 Y127.927 E.02486
G1 X124.802 Y127.506 E.01654
; CHANGE_LAYER
; Z_HEIGHT: 5
; LAYER_HEIGHT: 0.2
; WIPE_START
G1 F14612.423
G1 X125.013 Y127.927 E-.17889
G1 X125.445 Y128.487 E-.26886
G1 X124.775 Y128.487 E-.25465
G1 X124.775 Y128.336 E-.0576
; WIPE_END
G1 E-.04 F1800
; layer num/total_layer_count: 25/25
; update layer progress
M73 L25
M991 S0 P24 ;notify layer change
G17
G3 Z5.2 I1.217 J0 P1  F30000
;========Date 20250206========
; SKIPPABLE_START
; SKIPTYPE: timelapse
M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
 ; timelapse without wipe tower
M971 S11 C10 O0
M1004 S5 P1  ; external shutter

M623
; SKIPPABLE_END
; OBJECT_ID: 307
G1 X128.61 Y127.905
G1 Z5
G1 E.8 F1800
; FEATURE: Outer wall
; LINE_WIDTH: 0.42
G1 F3932
M204 S5000
G1 X128.291 Y127.983 E.01009
G3 X127.642 Y124.261 I-.324 J-1.861 E.18231
G1 X127.964 Y124.233 E.00994
G3 X128.66 Y127.88 I.003 J1.889 E.16064
; WIPE_START
G1 F12000
M204 S10000
G1 X128.291 Y127.983 E-.14531
G1 X127.964 Y128.019 E-.12514
G1 X127.635 Y127.99 E-.12536
G1 X127.317 Y127.904 E-.1253
G1 X127.018 Y127.765 E-.12547
G1 X126.773 Y127.594 E-.11342
; WIPE_END
G1 E-.04 F1800
G1 X132.79 Y130.053 Z5.4 F30000
G1 Z5
G1 E.8 F1800
G1 F3932
M204 S5000
G1 X123.21 Y130.053 E.29437
G1 X123.21 Y121.947 E.24905
G1 X132.79 Y121.947 E.29437
G1 X132.79 Y129.993 E.24721
; WIPE_START
G1 F12000
M204 S10000
G1 X130.79 Y130.005 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X132.583 Y122.85 Z5.4 F30000
M73 P95 R0
G1 Z5
G1 E.8 F1800
; FEATURE: Top surface
G1 F3932
M204 S2000
G1 X131.887 Y122.155 E.03023
G1 X131.354 Y122.155
G1 X132.583 Y123.384 E.0534
G1 X132.583 Y123.917
G1 X130.82 Y122.155 E.07658
G1 X130.287 Y122.155
G1 X132.583 Y124.45 E.09975
G1 X132.583 Y124.983
G1 X129.754 Y122.155 E.12292
G1 X129.221 Y122.155
G1 X132.583 Y125.517 E.14609
G1 X132.583 Y126.05
G1 X128.687 Y122.155 E.16927
G1 X128.154 Y122.155
G1 X132.583 Y126.583 E.19244
G1 X132.583 Y127.117
G1 X127.621 Y122.155 E.21561
G1 X127.088 Y122.155
G1 X132.583 Y127.65 E.23878
G1 X132.583 Y128.183
G1 X129.986 Y125.587 E.11283
G1 X130.059 Y126.193
G1 X132.583 Y128.716 E.10966
G1 X132.583 Y129.25
G1 X129.989 Y126.656 E.11272
G1 X129.845 Y127.045
G1 X132.583 Y129.783 E.11898
G1 X132.112 Y129.845
G1 X129.643 Y127.377 E.10727
G1 X129.391 Y127.658
G1 X131.579 Y129.845 E.09504
G1 X131.045 Y129.845
G1 X129.091 Y127.891 E.08491
G1 X128.74 Y128.073
G1 X130.512 Y129.845 E.077
G1 X129.979 Y129.845
G1 X128.328 Y128.195 E.07172
G1 X127.814 Y128.214
G1 X129.445 Y129.845 E.0709
G1 X128.912 Y129.845
G1 X127.098 Y128.031 E.07882
; WIPE_START
G1 F12000
M204 S10000
G1 X128.513 Y129.446 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X128.503 Y124.104 Z5.4 F30000
G1 Z5
G1 E.8 F1800
G1 F3932
M204 S2000
G1 X126.554 Y122.155 E.08469
G1 X126.021 Y122.155
G1 X127.897 Y124.031 E.08153
G1 X127.435 Y124.102
G1 X125.488 Y122.155 E.0846
G1 X124.955 Y122.155
G1 X127.045 Y124.245 E.09084
G1 X126.713 Y124.447
G1 X124.421 Y122.155 E.0996
G1 X123.888 Y122.155
G1 X126.432 Y124.698 E.11054
G1 X126.199 Y124.999
G1 X123.417 Y122.217 E.12086
G1 X123.417 Y122.751
G1 X126.017 Y125.35 E.11295
G1 X125.895 Y125.762
G1 X123.417 Y123.284 E.10767
G1 X123.417 Y123.817
G1 X125.876 Y126.276 E.10686
G1 X126.059 Y126.991
G1 X123.417 Y124.35 E.11477
G1 X123.417 Y124.884
G1 X128.379 Y129.845 E.21561
G1 X127.846 Y129.845
G1 X123.417 Y125.417 E.19243
G1 X123.417 Y125.95
G1 X127.312 Y129.845 E.16926
G1 X126.779 Y129.845
G1 X123.417 Y126.483 E.14609
G1 X123.417 Y127.017
G1 X126.246 Y129.845 E.12292
G1 X125.713 Y129.845
G1 X123.417 Y127.55 E.09974
G1 X123.417 Y128.083
G1 X125.179 Y129.845 E.07657
G1 X124.646 Y129.845
G1 X123.417 Y128.616 E.0534
G1 X123.417 Y129.15
G1 X124.113 Y129.845 E.03023
; WIPE_START
G1 F12000
M204 S10000
G1 X123.417 Y129.15 E-.37379
G1 X123.417 Y128.616 E-.20264
G1 X123.759 Y128.958 E-.18357
; WIPE_END
G1 E-.04 F1800
G1 X127.037 Y128.093 Z5.4 F30000
G1 Z5
G1 E.8 F1800
; FEATURE: Gap infill
; LINE_WIDTH: 0.198271
G1 F3932
G1 X126.883 Y127.985 E.00237
; LINE_WIDTH: 0.165027
G1 X126.744 Y127.868 E.00181
; LINE_WIDTH: 0.122243
G1 X126.604 Y127.751 E.00118
G3 X126.339 Y127.485 I42.936 J-43.202 E.00243
; LINE_WIDTH: 0.133322
G1 X126.222 Y127.346 E.00134
; LINE_WIDTH: 0.16617
M73 P96 R0
G1 X126.097 Y127.197 E.00195
; LINE_WIDTH: 0.199406
G1 X125.997 Y127.053 E.00223
; WIPE_START
G1 F15000
G1 X126.097 Y127.197 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X128.091 Y123.958 Z5.4 F30000
G1 Z5
G1 E.8 F1800
; LINE_WIDTH: 0.109284
G1 F3932
G1 X127.884 Y124.044 E.00121
; WIPE_START
G1 F15000
G1 X128.091 Y123.958 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X128.887 Y124.247 Z5.4 F30000
G1 Z5
G1 E.8 F1800
; LINE_WIDTH: 0.105958
G1 F3932
G1 X128.794 Y124.182 E.00058
; LINE_WIDTH: 0.153019
G2 X128.572 Y124.035 I-1.785 J2.45 E.00239
; WIPE_START
G1 F15000
G1 X128.794 Y124.182 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X130.055 Y125.518 Z5.4 F30000
G1 Z5
G1 E.8 F1800
; LINE_WIDTH: 0.161528
G1 F3932
G1 X129.973 Y125.389 E.00147
; LINE_WIDTH: 0.141463
G1 X129.908 Y125.296 E.00091
; LINE_WIDTH: 0.105929
G1 X129.843 Y125.203 E.00058
; WIPE_START
G1 F15000
G1 X129.908 Y125.296 E-.76
; WIPE_END
G1 E-.04 F1800
G1 X127.741 Y128.287 Z5.4 F30000
G1 Z5
G1 E.8 F1800
; LINE_WIDTH: 0.115017
G1 F3932
G1 X127.531 Y128.177 E.00139
; close powerlost recovery
M1003 S0
; WIPE_START
G1 F15000
G1 X127.741 Y128.287 E-.76
; WIPE_END
G1 E-.04 F1800
M106 S0
M106 P2 S0
M981 S0 P20000 ; close spaghetti detector
; FEATURE: Custom
; MACHINE_END_GCODE_START
; filament end gcode 

;===== date: 20230428 =====================
M400 ; wait for buffer to clear
G92 E0 ; zero the extruder
G1 E-0.8 F1800 ; retract
G1 Z5.5 F900 ; lower z a little
G1 X65 Y245 F12000 ; move to safe pos 
G1 Y265 F3000

G1 X65 Y245 F12000
G1 Y265 F3000
M140 S0 ; turn off bed
M106 S0 ; turn off fan
M106 P2 S0 ; turn off remote part cooling fan
M106 P3 S0 ; turn off chamber cooling fan

G1 X100 F12000 ; wipe
; pull back filament to AMS
M620 S255
G1 X20 Y50 F12000
G1 Y-3
T255
G1 X65 F12000
G1 Y265
G1 X100 F12000 ; wipe
M621 S255
M104 S0 ; turn off hotend

M622.1 S1 ; for prev firware, default turned on
M1002 judge_flag timelapse_record_flag
M622 J1
    M400 ; wait all motion done
    M991 S0 P-1 ;end smooth timelapse at safe pos
    M400 S3 ;wait for last picture to be taken
M623; end of "timelapse_record_flag"

M400 ; wait all motion done
M17 S
M17 Z0.4 ; lower z motor current to reduce impact if there is something in the bottom

    G1 Z105 F600
    G1 Z103

M400 P100
M17 R ; restore z current

M220 S100  ; Reset feedrate magnitude
M201.2 K1.0 ; Reset acc magnitude
M73.2   R1.0 ;Reset left time magnitude
M1002 set_gcode_claim_speed_level : 0

M17 X0.8 Y0.8 Z0.5 ; lower motor current to 45% power
M73 P100 R0
; EXECUTABLE_BLOCK_END

