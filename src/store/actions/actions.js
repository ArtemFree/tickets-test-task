export function addCheque(cheque){
    return {
        type : 'ADD_CHEQUE',
        payload : cheque
    }
}
export function openDialog(open){
    return {
        type : 'OPEN_DIALOG',
        payload : open
    }
}
export function addItems(items){
    return {
        type : 'ADD_ITEMS',
        payload : [...items]
    }
}
export function selectItems(items){
    return {
        type : 'SELECT_ITEMS',
        payload : [...items]
    }
}
export function deleteItems(){
    return {
        type : 'DELETE_ITEMS'
    }
}
export function deleteCheque(id){
    return {
        type : 'DELETE_CHEQUE',
        payload : id
    }
}