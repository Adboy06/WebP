export function getNotes(req,res){
     res.status(200).send("got notes thanks");
}
export function createnote(req,res){
    res.status(201).json({message:"note created "})
 }

 export function putnote(req,res){
        res.status(201).json({message:"note updated "})

}

export function deletenote(req,res){
    res.status(200).json({message:"note deleted"});
}