
const findRoomWithPlayer = (rooms) => {
    return rooms.findIndex(room => room.users.length === 1);
}

module.exports = {findRoomWithPlayer};