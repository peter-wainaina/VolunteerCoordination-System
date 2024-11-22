const SidebarReducer = (state, action) => {
    if(action.type === "TOGGLE_SIDEBAR"){
        return { 
            ...state, isSidebarOpen: !state.isSidebarOpen}
    }
    throw new Error(`No matching "${action.type} action type`);
}

export default SidebarReducer;