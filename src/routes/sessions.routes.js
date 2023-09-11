import { Router } from "express";
import { usersService } from "../dao/index.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from"passport";

const router = Router();

router.post("/signup", passport.authenticate("signupStrategy",{
    failureRedirect:"/api/sessions/fail-sipnup"
}) ,(req,res)=>{
    res.render("login", {message:"usuario registrado"});
});

router.get("/fail-signup",(req,res)=>{
    res.render("signup",{error:"No se pudo registrar al usuario"});
});

router.post("/login", passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/fail-login"
}), (req,res)=>{
    res.redirect("/perfil");
});

router.get("/fail-login", (req,res)=>{
    res.render("login",{error:"Credenciales invalidas"});
});


router.post("/changePass", async(req,res)=>{
    try {
        const form = req.body;
        const user = await usersService.getByEmail(form.email);
        if(!user){
            return res.render("changePassword",{error:"No se puede cambiar la contraseña"});
        }
        user.password = createHash(form.newpassword);
        console.log(user);
        await usersService.update(user.id,user);
        return res.render("login",{message:"Contraseña restaurada con exito"})
    } catch (error) {
        res.render("changePassword",{error:error.message});
    }
});

router.get("/loginGithub", passport.authenticate("githubloginStrategy"));

router.get("/github-callback", passport.authenticate("githubloginStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
}), (req,res)=>{
    res.redirect("/perfil");
});

router.get("/logout", (req,res)=>{
    req.logOut(error=>{
        if(error){
            return res.render("profile",{user: req.user, error:"No se pudo cerrar la sesion"});
        } else {
            //elimina la sesion de la base de datos
            req.session.destroy(error=>{
                if (error) return res.render("profile",{user: req.session.userInfo, error: "No se pudo cerrar la sesion"});
                res.redirect("/");
            })
        }
    })
    
});

export {router as sessionsRouter};
