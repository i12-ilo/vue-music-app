import * as types from "./mutation-types"
const mututaions = {
    [types.SET_SINGER](state,singer){
        console.log('xxxx',singer)
        state.singer.singerId = singer.singerId
        state.singer.url = singer.url;
        state.singer.name = singer.name;
    }
}

export default mututaions