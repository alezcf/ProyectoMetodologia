const Group = require('../models/Group');
const Employee = require('../models/Employee');

async function generateNextGroupRandom() {
  const lastGroup = await Group.findOne().sort({ group: -1 }).limit(1);
  return lastGroup ? parseInt(lastGroup.group) + 1 : 1;
}


exports.setGroup = async (req, res) => {
  try {
    let randomUserIds = [];
    let randomUserNames = [];
    let randomUserPositions = [];
    let groupRandom;

    const maxAttempts = 10; // Establecer el número máximo de intentos

    let attempts = 0;
    while (attempts < maxAttempts) {
      // Obtener una nueva lista de usuarios aleatorios
      const { randomPeople, randomPositions } = await Group.getRandomAttendance();
      randomUserIds = randomPeople.map(attendance => attendance.idUser);

      // Obtener los datos completos de los usuarios asociados a la asistencia desde el modelo Employee
      const populatedRandomPeople = await Employee.find({ rut: { $in: randomUserIds } }).select('names position');
      randomUserNames = populatedRandomPeople.map(employee => employee.names);
      randomUserPositions = populatedRandomPeople.map(employee => employee.position);

      // Verificar si alguno de los usuarios ya está en un grupo existente
      const existingGroup = await Group.findOne({ idUser: { $in: randomUserIds } });

      // Si no hay ningún grupo existente que contenga a estos usuarios, salir del bucle
      if (!existingGroup) {
        // Generar el número de grupo aleatorio
        groupRandom = await generateNextGroupRandom();

        // Crear un nuevo documento Grupo con los datos obtenidos
        const group = new Group({
          idUser: randomUserIds,
          names: randomUserNames, // Agregar los nombres al documento
          positions: randomUserPositions, // Agregar las posiciones al documento
          group: groupRandom
        });

        // Guardar el documento en la base de datos
        await group.save();
        res.status(200).json({ message: 'Grupo guardado correctamente', groupNumber: groupRandom });
        return; // Salir de la función después de guardar el grupo exitosamente
      }

      // Incrementar el contador de intentos
      attempts++;
    }

    // Si se supera el número máximo de intentos, enviar una respuesta de error
    res.status(500).json({ message: 'No se pudo encontrar un grupo válido después de varios intentos' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al guardar el grupo' });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    // Consulta para obtener todos los documentos de la colección "Group"
    const allGroups = await Group.find();

    // Devuelve los grupos como respuesta en formato JSON
    res.status(200).json(allGroups);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los grupos' });
  }
};


// Función para eliminar un grupo por su número de grupo
exports.deleteGroupByNumber = async (req, res) => {
  try {
    // Obtén el número del grupo que deseas eliminar de los parámetros de la solicitud
    const groupNumber = req.params.number;

    // Verifica si el grupo existe antes de intentar eliminarlo
    const group = await Group.findOne({ group: groupNumber });
    if (!group) {
      return res.status(404).json({ message: 'El grupo no existe' });
    }

    // Elimina el grupo de la base de datos
    await group.remove();

    // Devuelve una respuesta con el mensaje de éxito
    res.status(200).json({ message: 'Grupo eliminado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al eliminar el grupo' });
  }
};

