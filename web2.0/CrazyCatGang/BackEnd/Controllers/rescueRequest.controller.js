const RescueRequest = require('../Models/rescueRequest.model')

// Add rescue request
const createRescueRequest = async (req, res) => {
    try{
        const rescueRequest = await RescueRequest.create(req.body)
        res.status(200).json(rescueRequest)
    } catch (error){
        res.status(500).json(error.message);
    }
}

// Get all rescue requests
const getRescueRequests = async (req, res) => {
    try{
        const rescueRequests = await RescueRequest.find({})
        res.status(200).json(rescueRequests)
    } catch (error){
        res.status(500).json(error.message);
    }
}

// Get rescue request by ID
const getRescueRequestById = async (req, res) => {
    try{
        const { id } = req.params
        const rescueRequest = await RescueRequest.findById(id)
        res.status(200).json(rescueRequest)
    } catch (error){
        res.status(500).json(error.message);
    }
}

// Delete rescue request by ID
const deleteRescueRequestById = async (req, res) => {
    try{
        const { id } = req.params
        const rescueRequest = await RescueRequest.findByIdAndDelete(id)

        if(!rescueRequest) {
            res.status(404).json({message: "Pedido de resgate não encontrado."})
        }
        res.status(200).json({message: "Pedido deletado com sucesso!"})
    } catch (error){
        res.status(500).json(error.message);
    }
}

module.exports = {
    createRescueRequest,
    getRescueRequests,
    getRescueRequestById,
    deleteRescueRequestById
}