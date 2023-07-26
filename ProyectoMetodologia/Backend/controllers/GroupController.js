const Group = require('../models/group');

exports.getAllGroups = async (req, res) => { 

};
let counter = 0;

// Función para generar el siguiente número único
function generateNextGroupRandom() {
  return ++counter;
}

exports.setGroup = async (req, res) => {
    try {
      const randomAttendance = await Group.getRandomAttendance();
  
      const randomUserIds = randomAttendance.map(attendance => attendance.idUser);
        console.log(randomUserIds);
      const groupRandom = generateNextGroupRandom();
  
      // Verificar si el groupRandom ya existe en la base de datos
      const existingGroup = await Group.findOne({ groupRandom });
  
      if (existingGroup) {
        // Si el groupRandom ya existe, generar uno nuevo y verificar nuevamente
        res.redirect('/grupo/create');
        return;
      }
  
      // Crear un nuevo documento Grupo con los datos obtenidos
      const group = new Group({
        idUser: randomUserIds,
        group: groupRandom
      });
  
      // Guardar el documento en la base de datos
        await group.save();
      res.status(200).json({ message: 'Grupo guardado correctamente' });
    }
    catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al guardar el grupo' });
    }
  };