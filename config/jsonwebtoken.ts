import jsonwebtoken from "jsonwebtoken";

const createJWT = (payload:object, expiresIn: any, key:string) => {
    
     if(typeof payload !== "object" && !payload){
        throw new Error("Payload must be a non empty object")
     }
      if(typeof key !== "string" && key === ""){
       throw new Error("Key must be non empty string")
      }
    try {
    const token = jsonwebtoken.sign(payload,key,{expiresIn});

    return token
} catch (error) {
    console.log(error);
    throw error;
}
}

export default createJWT