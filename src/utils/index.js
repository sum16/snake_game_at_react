export const initFields = (fieldSize, initialPosition) => {
  // console.log(fieldSize); →35
  const fields = []
  for(let i=0; i <= fieldSize; i++) {
    const cols = new Array(fieldSize).fill('')
    fields.push(cols)
  }
  fields[initialPosition.y][initialPosition.x] = 'snake' // へび
  return fields
}