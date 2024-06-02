if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/Ghost/.gradle/caches/transforms-3/638f4a6be587c42f2bef2a216a25de67/transformed/jetified-hermes-android-0.74.1-release/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Ghost/.gradle/caches/transforms-3/638f4a6be587c42f2bef2a216a25de67/transformed/jetified-hermes-android-0.74.1-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

