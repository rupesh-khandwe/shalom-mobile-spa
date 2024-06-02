if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "C:/Workspace/shalom-mobile-spa/shalom-mobile-spa/node_modules/react-native-reanimated/android/build/intermediates/cxx/RelWithDebInfo/1t1k2y3o/obj/arm64-v8a/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Workspace/shalom-mobile-spa/shalom-mobile-spa/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

