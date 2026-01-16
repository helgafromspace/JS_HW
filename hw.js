// 1. Знайти користувачів у яких в імені є послідовність букв qw

db.userProfile.find({firstName:{$regex:/qw/i}})


// 2. Знайти користувачів у яких country дорівнює Ukraine

db.userProfile.find({country:'Ukraine'})


// 3. Знайти користувачів у яких в профайлі поле country не має значення
db.userProfile.find({country: null})


// 4. Знайти користувачів у яких в профайлі поле name не починається з літери a обовязково використовувати $where

db.userProfile.find({
  $where: function() { 
    return this.firstName.match(/[^a-zA-Z]/);
  }
})


// 5. Робота з $lookup

//відображаємо додатково інфу про юзерів із колеції userProfile

db.users.aggregate([
  {
    $lookup: {
      from: "userProfile",
      localField: "_id",
      foreignField: "userId", 
      as: "user_profile"
    }
  }
])

// відображаємо інфу про наявні моделі різних марок машин

db.carBrands.aggregate([
  {
    $lookup: {
      from: "carModels",
      localField: "_id",
      foreignField: "carBrandId", 
      as: "carModels"
    }
  }
])

// список машин з заданою структурою відповіді, де замість objectId юзера, бренду та моделі, бачимо ім'я, прізвище, назву бренду та модель + пробіг


db.cars.aggregate([
  {
    $lookup: {
      from: "userProfile",
      localField: "userId",
      foreignField: "userId", 
      as: "user_info"
    }
  },
    {
    $lookup: {
      from: "carBrands",
      localField: "carBrandId",
      foreignField: "_id", 
      as: "car_brand"
    }
  },
    {
    $lookup: {
      from: "carModels",
      localField: "carModelId",
      foreignField: "_id", 
      as: "car_model"
    }
  },

  { $unwind: "$user_info" },
  { $unwind: "$car_brand" },
  { $unwind: "$car_model" },
  {
    $project:{
        userName: "$user_info.firstName",
        userLastName: "$user_info.lastName",
        car_brand: "$car_brand.title",
        car_model: "$car_model.title",
        carMileage: "$mileage"
    }
  }
])

// 6. Додайте колекцію cars, так як це описано в схемі.


db.createCollection('cars', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'carBrandId', 'carModelId', 'mileage'],
      properties: {
        userId: { bsonType: 'objectId' },
        carBrandId: { bsonType: 'objectId' },
        carModelId: { bsonType: 'objectId' },
        mileage: { bsonType: 'int', minimum: 0 },
        initialMileage: { bsonType: 'int', minimum: 0 },
        updatedMileageAt: { bsonType: 'date' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
        carCreatedAt: { bsonType: 'date' }
      }
    }
  }
});
	

// 7. Додайте 10 автівок. (в мене в базі вже було 6, додала ще 5)

db.cars.insertMany(
[
    {
        userId: ObjectId('69669b1ea0115a23fc8de667'),
        carBrandId: ObjectId('6966a210a142d3aadd8de666'),
        carModelId: ObjectId('696a9e6248901eecdf8de666'),
        mileage: 800
    },
    {
        userId: ObjectId('69669fcda0115a23fc8de670'),
        carBrandId: ObjectId('6966a210a142d3aadd8de667'),
        carModelId: ObjectId('696a9e6248901eecdf8de668'),
        mileage: 100
    },
    {
        userId: ObjectId('69669b1ea0115a23fc8de668'),
        carBrandId: ObjectId('6966a210a142d3aadd8de667'),
        carModelId: ObjectId('6966a434a142d3aadd8de66d'),
        mileage: 5000
    },
    {
        userId: ObjectId('6966a210a142d3aadd8de666'),
        carBrandId: ObjectId('6966a210a142d3aadd8de666'),
        carModelId: ObjectId('696a9e6248901eecdf8de667'),
        mileage: 15600
    },
    {
        userId: ObjectId('696a860cb7a7f2c4148de668'),
        carBrandId: ObjectId('6966a210a142d3aadd8de668'),
        carModelId: ObjectId('696a9e6248901eecdf8de669'),
        mileage: 13200
    }
]);

// 8. Напишіть запит який буде повертати інформацію по машинам та їх власників у яких mileage буде більше або дорівнювати 100 и модель атомобіля ауді

db.cars.aggregate([
  {
    $lookup: {
      from: "userProfile",
      localField: "userId",
      foreignField: "userId", 
      as: "user_info"
    }
  },
    {
    $lookup: {
      from: "carBrands",
      localField: "carBrandId",
      foreignField: "_id", 
      as: "car_brand"
    }
  },
    {
    $lookup: {
      from: "carModels",
      localField: "carModelId",
      foreignField: "_id",  
      as: "car_model"
    }
  },

  { $unwind: "$user_info" },
  { $unwind: "$car_brand" },
  { $unwind: "$car_model" },

  { $match: {
    "mileage": {$gte: 100},
    "car_brand.title": "Audi"  
}
}, 
  {
    $project:{
        userName: "$user_info.firstName",
        userLastName: "$user_info.lastName",
        car_brand: "$car_brand.title",
        car_model: "$car_model.title",
        carMileage: "$mileage"
    }
  }
])

// 9. Знайти cars у яких бранд BMW або Audi

db.cars.aggregate([
  {
    $lookup: {
      from: "userProfile",
      localField: "userId",
      foreignField: "userId", 
      as: "user_info"
    }
  },
    {
    $lookup: {
      from: "carBrands",
      localField: "carBrandId",
      foreignField: "_id", 
      as: "car_brand"
    }
  },
    {
    $lookup: {
      from: "carModels",
      localField: "carModelId",
      foreignField: "_id", 
      as: "car_model"
    }
  },

  { $unwind: "$user_info" },
  { $unwind: "$car_brand" },
  { $unwind: "$car_model" },

  { $match: {
    "car_brand.title": {$in: ["Audi","BMW"]}  
}
}, 
  {
    $project:{
        userName: "$user_info.firstName",
        userLastName: "$user_info.lastName",
        car_brand: "$car_brand.title",
        car_model: "$car_model.title",
        carMileage: "$mileage"
    }
  }
])