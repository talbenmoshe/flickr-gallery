// this is to build the image url
export const urlFromDto = (dto) => {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
}