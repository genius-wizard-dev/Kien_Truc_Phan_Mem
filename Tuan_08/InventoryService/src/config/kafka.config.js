const { Kafka } = require("kafkajs");
const inventory = require("../models/inventory");

const kafka = new Kafka({
    clientId: "inventory-service",
    brokers: ["localhost:9094"]
});

const consumer = kafka.consumer({ groupId: "inventory-group" });

const createTopic = async () => {
    const admin = kafka.admin();

    try {
        await admin.connect();

        const topicName = "subtract-inventory-topic";

        const topics = await admin.listTopics();

        if (!topics.includes(topicName)) {
            await admin.createTopics({
                topics: [
                    {
                        topic: topicName,
                        numPartitions: 1,
                        replicationFactor: 1
                    }
                ]
            });

            console.log(`✅ Kafka topic '${topicName}' created.`);
        } else {
            console.log(`ℹ️ Kafka topic '${topicName}' already exists.`);
        }

        await admin.disconnect();
    } catch (error) {
        console.error("❌ Error creating topic:", error);
    }
};

const runKafka = async () => {
    await createTopic();
    await consumer.connect();
    await consumer.subscribe({ topic: "subtract-inventory-topic", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value.toString());
            const { productId, quantity } = data;

            const updated = await inventory.updateOne(
                { product_id: productId, total_quantity: { $gte: quantity } },
                { $inc: { total_quantity: -quantity } }
            );

            if (updated.modifiedCount === 0) {
                console.warn(`[Inventory] Not enough stock for product ${productId}`);
            } else {
                console.log(`[Inventory] Subtracted ${quantity} from product ${productId}`);
            }
        }
    });
};

module.exports = runKafka;
