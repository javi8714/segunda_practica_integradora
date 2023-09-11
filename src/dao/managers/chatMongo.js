
import chatModel from "../models/chat.models.js"

export default class MessagesManager {
  getMessages = async () => {
    try {
      return await chatModel.find().lean().exec();
    } catch (error) {
      return error;
    }
  }
  
  createMessage = async (message) => {
    try {
      return await chatModel.create(message);
    } catch (error) {
      return error;
    }
  }

  eleteAllMessages = async () => {
    try {
      console.log("Borrando todos los mensajes...");
      const result = await chatModel.deleteMany({});
      console.log("Mensajes borrados:", result);
      return result;
    } catch (error) {
      console.error("Error al borrar los mensajes:", error);
      return error;
    }
  }
}