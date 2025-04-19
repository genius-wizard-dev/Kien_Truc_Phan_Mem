const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "product-service",
    brokers: ["localhost:9094"]
});

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
};

const publishProductCreated = async (product) => {
    await producer.send({
        topic: "product_created",
        messages: [
            {
                key: product._id.toString(),
                value: JSON.stringify(product)
            }
        ]
    });
};

module.exports = {
    connectProducer,
    publishProductCreated
};
