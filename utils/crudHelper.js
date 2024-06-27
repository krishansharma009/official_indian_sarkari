const _getAll = async (req, res, model) => {
  try {
    const response = await model.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const _getDataListById = async (req, res, model, fieldName, fieldValue) => {
  try {
    const response = await model.findAll({
      where: { [fieldName]: fieldValue },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const _update = async (req, res, model) => {
  try {
    const { id } = req.params; // Take id from req.params
    const response = await model.update(req.body, {
      where: {
        id: id, // Use id from req.params
      },
    });
    if (response[0] === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const _delete = async (req, res, model) => {
  try {
    const { id } = req.params; // Take id from req.params
    const response = await model.destroy({
      where: {
        id: id, // Use id from req.params
      },
    });
    if (response === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json({ message: "Deletion successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const _add = async (req, res, model) => {
  try {
    const response = await model.create(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  _getAll,
  _getDataListById,
  _update,
  _delete,
  _add,
};
