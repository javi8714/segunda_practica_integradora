import { productsModel } from "../models/products.model.js"

export class ProductManagerMongo {
  constructor(){
       this.model = productsModel;              
    }


    async get(){
      try {
          const products = await this.model.find().lean();
          return products;
      } catch (error) {
          throw error;
      }
    }

    async getPaginate(query, options){
        try { 
           const resultp = await this.model.paginate(query, options);
           return resultp;
        } catch (error) {
           throw error;
        }
    }


    getProductById = async (id) => {
        try {
            return await productsModel.findById(id)

        } catch (error) {
            return { error: err.message }
        }

    }
    
    async save(product){
      try {
           const productCreation = await this.model.create(product);
           return productCreation;      
      } catch (error) {
          throw error;
      }
    } 



    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title })
        }
        catch (err) {
            return err
        }

    };



    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product });
        } catch (err) {
            return err
        }

    }



    deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch (err) {
            return err
        }

    }

};