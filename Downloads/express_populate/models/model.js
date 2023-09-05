const path = require("path");
const fs = require("fs");
const { success } = require("../write/message");
const fsPromise = fs.promises;
const filePath1 = path.join(__dirname, "..", "data", "products.json");
const filePath2 = path.join(__dirname, "..", "data", "review.json");
const filePath3 = path.join(__dirname, "..", "data", "customer.json");
const logFilePath = './server/log.txt';
class myPromise {
    createLogFile(message) {
        const time = new Date().toISOString();
        const text = `${time}:${message}\n`
        fs.appendFile(logFilePath, text, (err) => {
            if (err) {
                return { message: "Error writing the file" };
            }

        })
    }
    async getAll() {
        try {
            const content = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
            const data = JSON.parse(content);
            return { success: true, data: data };
        } catch (error) {
            return { error };
        }

    }
    async commonId(id) {
        try {
            const content1 = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
            const content2 = await fsPromise.readFile(filePath2, { encoding: "utf-8" });
            const data1 = JSON.parse(content1);
            const data2 = JSON.parse(content2);
            //const connectedData = [];
            const arr = data1.filter((x) => x.id == id)
            if (arr.length == 0) {
                return { success: false, message: "Product does not exist!" }
            }
            else {
                const index = data1.findIndex((item) => item.id == id)
                // for (let i = 0; i < data1[index].reviews.length; i++) {
                //     for (let j = 0; j < data2.length; j++) {
                //         if (data1[index].reviews[i] == data2[j].id) {
                //             connectedData.push(data2[j].comment);
                //         }
                //     }
                // }
                const reviewArr = data1[index].reviews;
                const res = reviewArr.map((review) => data2.find((x) => x.id == review));
                const connectedData = res.map((item) => item.comment);
                return { success: true, data: connectedData };
            }


        } catch (error) {
            return { error };
        }
    }
    async joinRating(id, rating) {
        try {
            const content1 = await fsPromise.readFile(filePath3, { encoding: "utf-8" });
            const content2 = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
            const data1 = JSON.parse(content1);
            const data2 = JSON.parse(content2);
            const arr = data1.filter((x) => x.id == id)
            if (arr.length == 0) {
                return { success: false, message: "User not found" };
            }
            else {
                const ans = [];
                const index = data1.findIndex((item) => item.id == id)
                // for (let i = 0; i < data1[index].reviews.length; i++) {
                //     for (let j = 0; j < data2.length; j++) {
                //         if (data1[index].reviews[i] == data2[j].id) {
                //             connectedData.push(data2[j].comment);
                //         }
                //     }
                // }
                const reviewArr = data1[index].purchased_products;
                const result = reviewArr.map((product) => data2.find((x) => x.id == product));
                const connectedData = result.map((item) => item);
                const array = connectedData.filter((x) => {
                    if (x.rating >= rating) {
                        ans.push({ name: x.name, rating: x.rating });
                    }
                })

                return { success: true, data: ans };
            }

        } catch (error) {
            return { error };
        }
    }
    async filterByCategory(category) {
        try {
            const content = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
            const data = JSON.parse(content);
            const arr = data.filter((x) => x.category == category)
            if (arr.length == 0) {
                return { success: false, message: "No product for this category" };
            }
            else {
                return { success: true, data: arr };
            }
        } catch (error) {
            return { error };
        }
    }
    async filterByBrand(brand) {
        try {
            const content = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
            const data = JSON.parse(content);
            const arr = data.filter((x) => x.brand == brand)
            if (arr.length == 0) {
                return { success: false, message: "No product for this brand" };
            }
            else {
                return { success: true, data: arr };
            }
        } catch (error) {
            return { error };
        }
    }
    async filterByName(name) {
        try {
            const content = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
            const data = JSON.parse(content);
            const arr = data.filter((x) => x.name == name)
            if (arr.length == 0) {
                return { success: false, message: "No product for this Name" };
            }
            else {
                return { success: true, data: arr };
            }
        } catch (error) {
            return { error };
        }
    }
    async add(newData) {
        const content = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
        const jsonData = JSON.parse(content)
        // const newData = JSON.parse(manga)
        // const errors = {};
        // if (newData.name === "" || !newData.name) {
        //     errors.name = "Name is missing";
        // }

        // if (!newData.price || newData.price === "") {
        //     errors.price = "Price is missing";
        // }
        // else if (newData.price < 4) {
        //     errors.pricelimit = "Price cant be less than 4";
        // }
        // if (!newData.category || newData.category === "") {
        //     errors.stock = "Stock is missing";
        // }
        // if (!newData.brand || newData.brand === "") {
        //     errors.stocklimit = "Stock cant be less than 10";
        // }
        // if (!newData.color || newData.color === "") {
        //     errors.stocklimit = "Stock cant be less than 10";
        // }
        // if (!newData.size || newData.size === "") {
        //     errors.author = "Author is missing";
        // }

        // else if (Object.keys(errors).length > 0) {
        //     const errorMessages = Object.keys(errors).map(field => errors[field]);
        //     return { failure: true, message: errorMessages };
        // }


        if (!newData.id) {
            const resultData = { ...newData, id: jsonData[jsonData.length - 1].id + 1 }
            jsonData.push(resultData)
            const data = JSON.stringify(jsonData)
            return fsPromise
                .writeFile(filePath1, data)
                .then((data) => {
                    return { success: true, data: data }
                })
                .catch((error) => {
                    return { error }
                })
        }
        else if (newData.id) {
            const arr = jsonData.filter((ob) => ob.id === newData.id)
            if (arr.length > 0) {
                return { success: false, message: "ID already exists" };
            }
            else {
                jsonData.push(newData);
                const data = JSON.stringify(jsonData)
                return fsPromise
                    .writeFile(filePath1, data)
                    .then((data) => {
                        return { success: true, data: data }
                    })
                    .catch((error) => {
                        return { error }
                    })
            }
        }

    }

    async updatebyId(id, fields) {
        try {
            const content = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
            const Data = JSON.parse(content);
            console.log(Data)
            const index = Data.findIndex(item => item.id == id);
            console.log(index);
            if (index === -1) {
                return { success: false, message: "Id does not exist!" };
            }

            if ('id' in fields) {
                return { success: false, message: "ID cannot be updated." };
            }

            Data[index] = { ...Data[index], ...fields };
            const data = JSON.stringify(Data);

            await fsPromise.writeFile(filePath1, data);

            return { success: true, data: Data[index] };
        } catch (error) {
            return { success: false, message: "An error occurred while updating." };
        }
    }
    async categorySort(category) {
        try {
            const content = await fsPromise.readFile(filePath1, { encoding: "utf-8" });
            const data = JSON.parse(content);
            const arr = data.filter((x) => x.category == category)
            if (arr.length == 0) {
                return { success: false, message: "No product for this category" };
            }
            else {
                arr.sort((a, b) => b.rating - a.rating);
                return { success: true, data: arr };
            }
        } catch (error) {
            return { error };
        }
    }
    async filterByReviewLen(purchase, review) {
        try {

            const content = await fsPromise.readFile(filePath3, { encoding: "utf-8" });
            const data = JSON.parse(content);
            const arr = data.filter((customer) => customer.purchased_products.length == purchase && customer.reviews_written.length == review)
            return { success: true, data: arr };
        } catch (error) {
            return { error };
        }
    }
    async deletebyId(id) {
        try {
            const content = await fsPromise.readFile(filePath1, { encoding: "utf-8" })
            const jsonData = JSON.parse(content)
            const filterItem = jsonData.filter((x) => x.id != id)
            if (filterItem.length == jsonData.length) {
                return { success: false, message: "Id not found!" }
            }
            const data = JSON.stringify(filterItem)
            await fsPromise.writeFile(filePath1, data)
            return { success: true, data: JSON.parse(data) }
        } catch (error) {
            return { error }
        }

    }
    async getById(id) {
        return fsPromise
            .readFile(filePath1, { encoding: "utf-8" })
            .then((data) => {
                const Data = JSON.parse(data);
                const checkId = Data.filter((x) => x.id != id)
                if (checkId.length == Data.length) {
                    return { success: false, message: "Id does not exist!" };
                }
                else {
                    const index = Data.findIndex((item) => item.id == id)
                    const ans = Data[index];
                    return { success: true, data: ans }
                }

            })
            .catch((error) => {
                return { error }
            })

    }




    // async filterByAny(param, value) {
    //     const content = await fsPromise.readFile(filePath1, { encoding: 'utf-8' });
    //     const data = JSON.parse(content);

    //     // Use the filter method to filter products based on the provided parameter and value
    //     const filteredProducts = data.filter((product) => product.param === value);

    //     if (filteredProducts.length === 0) {
    //         return { success: false };
    //     } else {
    //         //res.status(200).json({ success: true, data: filteredProducts });
    //         return { success: true, data: filteredProducts }
    //     }
    // }


}

module.exports = new myPromise();