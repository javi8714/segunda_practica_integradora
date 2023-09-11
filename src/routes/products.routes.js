import { Router } from "express"; 
import { productService } from "../dao/index.js";



const router = Router();


const validateFields = (req,res,next)=>{
    const productInfo = req.body
    if (!productInfo.title || !productInfo.description || !productInfo.price || !productInfo.code || !productInfo.stock || !productInfo.status || !productInfo.category) {
        return res.json({ status: "error", message: "Campos incompletos! Completar." })
    } else {
        next();
    }
};

// Obtengo los prod de acuerdo al limite de prod que ingrese
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products =  await productService.getProducts();
        let resultado = 0;
        if (limit) {
            
            //devolver productos de acuerdo al limite
            const limite = parseInt(req.query.limit);
            console.log("limite: ", limite);
            if (limite > 0) {
                resultado = products.slice(0,limite);
            } else {
                resultado = products;
            }
            res.send(resultado);

        } else {
            res.json({ status: "success", data: products });
        }
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});


// Retorno el prod por id: http://localhost:8080
router.get("/:pid", async (req, res) => {
    try {
        let pid = req.params.pid;
        let result = await productService.getProductById(pid);
        res.json({ status: 'success', data: result });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
        //throw new Error(error.message);
    }
});

// Doy de alta el producto
router.post("/",validateFields, async (req,res)=>{
    try {
        const productInfo = req.body;
        const productsCreate = await productService.save(productInfo);
        res.json({status:"succcess", data:productsCreate, message:"producto creado"})
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

// Actualizo el producto segun id
router.put("/:pid", validateFields,  async (req, res) => {
    try {
        let pid = req.params.pid;
        let product = req.body;
        let result =  await productService.updateProduct(pid, product);
        result.id = pid;
        res.json({ status: 'success', data: result });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
        //throw new Error(error.message);
    }
});

// Doy de baja el producto segun ID
router.delete("/:pid", async (req, res) => { 
    try {
        let pid = req.params.pid;
        let result =  await productService.deleteProduct(pid);
        res.json({ status: "success", data: deleteProduct, message: "Producto borrado!" });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});



export {router as productsRouter}


