export const config = {
    server : {
        port:8080,
        secretSession:"claveSecretaSessions"
    },
    FileSystem: {
        prdoductsFile:"products.json",
        cartFile:"carts.json",
    },
    mongo:{
       url:"mongodb+srv://javierdibalada14:Moreno8714)@cluster0.iye3imd.mongodb.net/?retryWrites=true&w=majority"
    },
    github:{
        clientId:"Iv1.e4a88cda317cbcdd",
        clienteSecret:"291147b83fb3698d297115a0787e0abae0a3f6a4",
        callbackUrl:"http://localhost:8080/api/sessions/github-callback"
    }
}