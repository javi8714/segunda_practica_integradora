import { Router } from "express";
import { productService } from "../dao/index.js";
import { checkUserAuthenticated, showLoginView } from "../middlewares/auth.js";



const router = Router();


//routes
router.get("/",(req,res)=>{
    res.render("home");
});


router.get("/registro",showLoginView, (req,res)=>{
    res.render("signup");
});

router.get("/login",showLoginView, (req,res)=>{
    res.render("login");
});


router.get("/perfil", checkUserAuthenticated, (req,res)=>{
    console.log(req.user);
    res.render("profile",{user: JSON.parse(JSON.stringify(req.user))});
});

router.get("/cambio-password",(req,res)=>{
    res.render("changePassword")
});


router.get("/realtimeproducts", async (req, res) => {
    try {
        const { limit = 10, page = 1, stock, sort = "asc" } = req.query;

        console.log(limit, page, stock, sort);
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        if (!["asc", "desc"].includes(sort)) {
            return res.render("products", { error: "Pedido no valido" });
        }
        const sortValue = sort === "asc" ? 1 : -1;
        let query = {};
        if (stockValue) {
            query = { stock: { $gte: stockValue } };
        }
        const resultp = await productService.getWithPaginate(query, {
            page,
            limit,
            sort: { price: sortValue },
            lean: true,
        });
        
        // http://localhost:8080
        const baseURL = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        const ViewResultProducts = {
            status: "success",
            payload: resultp.docs,
            totalPages: resultp.totalPages,
            prevPage: resultp.PrevPage,
            nextPage: resultp.nextPage,
            page: resultp.page,
            hasPrevPage: resultp.hasPrevPage,
            hasNextPage: resultp.hasNextPage,
            prevLink: resultp.hasPrevPage
                ? `${baseURL.replace(`page=${resultp.page}`, `page=${resultp.prevPage}`)}`
                : null,
            nextLink: resultp.hasNextPage
                ? `${baseURL.replace(`page=${resultp.page}`, `page=${resultp.nextPage}`)}`
                : null,
        };
        console.log(ViewResultProducts);
        res.render("products", ViewResultProducts);
    } catch {
        res.render("realtimeproduct", { error: "No se pueden ver los datos" });
    }
});

export { router as viewsRouter };
