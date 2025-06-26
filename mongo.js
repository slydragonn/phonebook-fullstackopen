import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("give Password ");
  process.exit(1);
}

const password = process.argv[2];

const dbURL = `mongodb+srv://alogo:${password}@cluster0.l6kfyev.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(dbURL);

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

if (process.argv.length === 3) {
  Phone.find({}).then((result) => {
    result.forEach((phone) => {
      console.log(phone);
    });

    mongoose.connection.close();
    process.exit(1);
  });
} else {
  const newPhone = new Phone({
    name: process.argv[3],
    number: process.argv[4],
  });

  newPhone.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
