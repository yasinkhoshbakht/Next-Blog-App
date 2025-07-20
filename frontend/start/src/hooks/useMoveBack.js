"use client"
const { useRouter } = require("next/navigation");

function useMoveBack(){
    const router = useRouter()
    return ()=> {router.back()}
}

export default useMoveBack