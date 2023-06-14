/**
 * @description loops through the positions array - if dubble obligations - meaning bulk loan, it sums the debt and adds a counter
 * @params array of objects - each object being an open position
 * @returns array of objects with bulk loans merged into one object
 */
export function mergeDuplicates(arr: any) {
  const mergedArr = []; // initialize an empty array to store the merged objects

  // create an object to keep track of how many times an obligation occurs
  const obligationCount = {};

  // loop through each object in the array
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    const obligation = obj.obligation;
    // @ts-ignore
    if (!obligationCount[obligation]) {
      // if the obligation hasn't occurred before
      // @ts-ignore
      obligationCount[obligation] = 1; // set its count to 1
      mergedArr.push(obj); // add the object to the merged array
    } else {
      const index = mergedArr.findIndex(item => item.obligation === obligation); // find the index of the existing object with the same obligation
      // @ts-ignore
      obligationCount[obligation] += 1;
    }
  }
  // add the count field to each merged object
  for (let i = 0; i < mergedArr.length; i++) {
    const obligation = mergedArr[i].obligation;
    // @ts-ignore
    mergedArr[i].count = obligationCount[obligation];
  }

  return mergedArr; // return the merged array with the count field added to each object
}
