export function removeFromArray(array, item){
    const indexToRemove = array.indexOf(item);

    if (indexToRemove !== -1) {
        array.splice(indexToRemove, 1);
    }

    return array;
}