import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const filePath = fileURLToPath(import.meta.url)
const textFilePath = path.join(
  path.dirname(filePath),
  "../data",
  "current_fuel_price.txt"
);

export const updateFuelPrice = async (req, res) => {
  const { price } = req.body;
  try {
    await writeFile(textFilePath, price.toString(), "utf-8");
    console.log("Written to File");
    res.status(200).json({ success: true, message: "Written to the file" });
  } catch (error) {
     console.log(error.response.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getFuelPrice = async (req, res) => {
     try {
     const price = await readFile(textFilePath, "utf-8");
       res.status(200).json({ success: true, price:price });
     } catch (error) {
       console.log(error.response.message);
       res
         .status(500)
         .json({ success: false, message: "Internal Server Error" });
     }
 } 
