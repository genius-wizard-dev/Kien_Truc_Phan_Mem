import Discount, { DiscountDocument } from "../models/discount.model";
import { DiscountInput, UpdatedDiscountInput } from "../validation/discount.schema";
import createError from "http-errors";
import mongoose from "mongoose";

class DiscountService {
    static async createDiscount(discountData: DiscountInput["body"]): Promise<DiscountDocument> {
        try {
            const { code } = discountData;

            const discount = await Discount.findOne({ code });

            if (discount) throw createError.Conflict("The discount code exists");

            const createdDiscount: DiscountDocument = await Discount.create(discountData);

            return createdDiscount.toObject();
        } catch (error) {
            throw error;
        }
    }
    static async getDiscounts(shopId?: string, productId?: string): Promise<DiscountDocument[]> {
        try {
            const query: any = {};

            if (shopId) {
                query.shop = new mongoose.Types.ObjectId(shopId);
            }

            if (productId) {
                const productObjectId = new mongoose.Types.ObjectId(productId);

                query.$or = [
                    { applied_product_type: "all" },
                    { applied_product_type: "specific", applied_product_list: productObjectId }
                ];
            }

            const discounts = await Discount.find(query);

            return discounts;
        } catch (error) {
            throw error;
        }
    }

    static async getDiscount(discountId: String): Promise<DiscountDocument | null> {
        try {
            const discount: DiscountDocument | null = await Discount.findOne({ discountId });
            return discount;
        } catch (error) {
            throw error;
        }
    }

    static async updateDiscount(
        discountId: String,
        discountData: UpdatedDiscountInput["body"]
    ): Promise<DiscountDocument> {
        try {
            const { code } = discountData;
            const discount = await Discount.findOne({ code });

            if (discount) throw createError.Conflict("Discount have been existed");

            const updatedDiscount = await Discount.findByIdAndUpdate(discountId, discountData, { new: true });

            if (!updatedDiscount) throw createError.NotFound("Discount does not exist");

            return updatedDiscount.toObject();
        } catch (error) {
            throw error;
        }
    }

    static async deleteDiscount(discountId: String): Promise<void> {
        try {
            await Discount.findByIdAndDelete(discountId);
        } catch (error) {
            throw error;
        }
    }

    static async getDiscountsByShop(shopId: String): Promise<DiscountDocument[]> {
        const discountList = await Discount.find({ shop: shopId });

        return discountList;
    }

    static async getProductsByDiscount() {}
}

export default DiscountService;
