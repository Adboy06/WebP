import express from "express"
import { createnote,getNotes,deletenote,putnote } from "../controllers/notesController.js";



const router=express.Router();


router.get("/", getNotes);

router.post("/", createnote)


router.put("/:id",putnote
)
router.delete("/:id",deletenote)
export default router;