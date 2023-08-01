const Group = require('../models/Group');
const Employee = require('../models/Employee');

async function generateNextGroupRandom() {
  const lastGroup = await Group.findOne().sort({ group: -1 }).limit(1);
  return lastGroup ? parseInt(lastGroup.group) + 1 : 1;
}


exports.setGroup = async (req, res) => {
  try {
    // Obtener la asistencia diaria desde el modelo Group
    const dailyAttendance = await Group.getAttendanceAndProcess();
    console.log('Asistencia' + dailyAttendance);

    // Obtener los IDs de los usuarios que han firmado en el día
    const signedUserIds = dailyAttendance.map(attendance => attendance.idUser);

    console.log('Usuarios que han firmado' + signedUserIds);

    // Obtener los IDs de los usuarios que ya tienen grupo asignado
    const employeesWithGroup = await getEmployeesWithGroup();

    console.log('Usuarios con grupo' + employeesWithGroup);

    const employeesWithGroupIds = employeesWithGroup.map(employee => employee.rut);

    console.log('IDs de usuarios con grupo' + employeesWithGroupIds);

    // Obtener los IDs de los usuarios que no tienen grupo y no han firmado en el día
    const availableUserIds = dailyAttendance.filter(attendance => !employeesWithGroupIds.includes(attendance.idUser))
      .map(attendance => attendance.idUser);

    console.log('Usuarios disponibles' + availableUserIds);

    // Si no hay suficientes usuarios disponibles para formar un nuevo grupo, enviar una respuesta de error
    if (availableUserIds.length < 6) {
      res.status(501).json({ message: 'No hay suficientes usuarios disponibles para formar un nuevo grupo' });
      return;
    }

    // Seleccionar aleatoriamente 6 usuarios para el nuevo grupo
    const selectedUserIds = getRandomPeople(availableUserIds, 6);

    console.log('Usuarios seleccionados' + selectedUserIds);

    // Obtener los datos completos de los usuarios asociados a los IDs seleccionados desde el modelo Employee
    const selectedEmployees = await Employee.find({ rut: { $in: selectedUserIds } }).select('names position rut');

    console.log('Empleados seleccionados' + selectedEmployees);

    const selectedUserrut = selectedEmployees.map(employee => employee.rut);
    const selectedUserNames = selectedEmployees.map(employee => employee.names);
    const selectedUserPositions = selectedEmployees.map(employee => employee.position);

    // Generar el número de grupo aleatorio
    const groupRandom = await generateNextGroupRandom();

    // Crear un nuevo documento Grupo con los datos obtenidos
    const group = new Group({
      idUser: selectedUserrut,
      names: selectedUserNames, // Agregar los nombres al documento
      positions: selectedUserPositions, // Agregar las posiciones al documento
      group: groupRandom
    });
    // Guardar el documento en la base de datos
    await group.save();
    res.status(200).json({ message: 'Grupo guardado correctamente', groupNumber: groupRandom });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al guardar el grupo' });
  }
};

function getRandomPeople(array, count) {
  // Utilizar el algoritmo de Fisher-Yates para mezclar aleatoriamente el array
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Devolver los primeros 'count' elementos del subconjunto mezclado aleatoriamente
  return shuffledArray.slice(0, count);
}

async function getEmployeesWithGroup() {
  try {
    const groupsWithEmployees = await Group.find({ idUser: { $exists: true, $ne: [] } });

    // Obtener los IDs de los usuarios que ya tienen grupo asignado
    const employeesWithGroupIds = groupsWithEmployees.flatMap(group => group.idUser);

    const employeesWithGroup = await Employee.find({ rut: { $in: employeesWithGroupIds } });
    return employeesWithGroup;
  } catch (error) {
    throw error;
  }
}

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
    console.log('llego a delete');
    const groupNumber = req.body.number;
    console.log('Grupo: ' + groupNumber);
    const group = await Group.findOne({ group: groupNumber });
    if (!group) {
      return res.status(404).json({ message: 'El grupo no existe' });
    }
    console.log(group);
    await group.deleteOne();

    // Devuelve una respuesta con un objeto JSON indicando éxito
    res.status(200).json({ success: true, message: 'Grupo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al eliminar el grupo' });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { selectedNewMember, groupNumber, selectedMemberToReplace } = req.body;
    console.log('Grupo: ' + groupNumber);
    console.log('Nuevo miembro: ' + selectedNewMember);
    console.log('Miembro a reemplazar: ' + selectedMemberToReplace);

    // Verificar si hay al menos un usuario seleccionado para el grupo
    if (!selectedNewMember || !groupNumber || !selectedMemberToReplace) {
      return res.status(400).json({ message: 'Debe proporcionar todos los campos necesarios' });
    }

    // Buscar el grupo por su número de grupo
    const existingGroup = await Group.findOne({ group: groupNumber });

    if (!existingGroup) {
      return res.status(404).json({ message: 'El grupo no existe' });
    }

    // Verificar si el usuario a reemplazar está presente en el grupo
    const userToReplaceIndex = existingGroup.idUser.indexOf(String(selectedMemberToReplace));

    if (userToReplaceIndex === -1) {
      return res.status(404).json({ message: 'El usuario a reemplazar no está en el grupo' });
    }
    console.log('Indice del usuario a reemplazar: ' + userToReplaceIndex);
    
    // Verificar si el nuevo usuario ya está presente en otro grupo
    const existingGroups = await Group.find({ idUser: { $exists: true, $ne: [] } });
    const existingUsers = existingGroups.flatMap(group => group.idUser);

    console.log('Usuarios existentes: ' + existingUsers);

    if (existingUsers.includes(selectedNewMember)) {
      return res.status(400).json({ message: 'El nuevo miembro ya pertenece a otro grupo' });
    }


    if (selectedMemberToReplace === selectedNewMember) {
      return res.status(400).json({ message: 'El nuevo miembro ya pertenece a otro grupo' });
    }

    // Reemplazar al usuario en el grupo con el nuevo usuario
    existingGroup.idUser[userToReplaceIndex] = selectedNewMember;

    // Asignar el nombre y la posición del nuevo miembro al existingGroup
    const selectedEmployees = await Employee.find({ rut: { $in: selectedNewMember } }).select('names position');
    console.log(selectedEmployees);
    const firstSelectedEmployee = selectedEmployees[0];
  
    existingGroup.names[userToReplaceIndex] = firstSelectedEmployee.names;
    existingGroup.positions[userToReplaceIndex] = firstSelectedEmployee.position;

    await existingGroup.save();

    res.status(200).json({ message: 'Grupo actualizado correctamente', groupNumber: existingGroup.group });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al actualizar el grupo' });
  }
};
