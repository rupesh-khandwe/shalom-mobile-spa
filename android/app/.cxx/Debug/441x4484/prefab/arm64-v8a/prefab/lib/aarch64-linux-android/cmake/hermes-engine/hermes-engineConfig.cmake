if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/Ghost/.gradle/caches/transforms-3/6a8b3aeab00cab0ffa08abc43fbc6f8d/transformed/jetified-hermes-android-0.74.1-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Ghost/.gradle/caches/transforms-3/6a8b3aeab00cab0ffa08abc43fbc6f8d/transformed/jetified-hermes-android-0.74.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

