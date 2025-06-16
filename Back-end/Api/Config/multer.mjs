import multer from "multer";
import path from "path";

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pasta onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    // Nome único para cada arquivo com base no timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Inicializa o multer
const upload = multer({ storage: storage });

export default upload;
