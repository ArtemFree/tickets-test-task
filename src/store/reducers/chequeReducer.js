let initialState = {
    cheques : [],
    count : 0,
    dialogOpen : false, 
    selected : []
}

export function chequeReducer(state = initialState, action){
    switch(action.type){
        case 'ADD_CHEQUE':
            console.log('ADD')
            return {...state, count : state.count + 1, cheques : [...state.cheques, action.payload]};

        case 'OPEN_DIALOG':
            console.log('OPEN_DIALOG')
            return {...state, dialogOpen : action.payload};

        case 'ADD_ITEMS':
            console.log('ADD ITEMS')
            return {...state, count : [...state.cheques, ...action.payload].length, cheques : [...state.cheques, ...action.payload]};

        case 'DELETE_CHEQUE':
            console.log('DELETE')
            return state;

        case 'DELETE_ITEMS':
            console.log('DELETE_ITEMS')
            let newCheques = [...state.cheques];
            console.log(state.selected)
            state.selected.forEach(selected => {
                newCheques = newCheques.filter((c, i) => c.uid !== selected);
            })
            console.log(newCheques)
            return {...state, cheques : newCheques, selected : [], count : newCheques.length};

        case 'SELECT_ITEMS':
            // console.log('SELECT')
            console.log(action.payload)
            return {...state, selected : action.payload};

        default:
            return state;
    }
}