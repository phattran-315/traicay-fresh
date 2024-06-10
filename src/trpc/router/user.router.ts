import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { getPayloadClient } from "../../payload/get-client-payload";
import { TRPCError } from "@trpc/server";
import {
  AddressValidationSchema,
  PhoneValidationSchema,
} from "../../validations/user-infor.valiator";
import { SignUpCredentialSchema } from "../../validations/auth.validation";
import { CartItems, Product } from "../../payload/payload-types";
import {
  ADDRESS_MESSAGE,
  NAME_MESSAGE,
  PHONE_NUMBER_MESSAGE,
  USER_MESSAGE,
} from "../../constants/api-messages.constant";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";

const CartItemSchema = z.object({
  product: z.string(),
  quantity: z.number(),
  coupon: z.string().nullable().optional(),
  discountAmount: z.number().nullable().optional(),
  isAppliedCoupon: z.boolean().nullable().optional(),
  shippingCost: z.number().nullable().optional(),
});

const getUserProcedure = privateProcedure.use(async ({ ctx, next }) => {
  const { user } = ctx;
  try {
    const payload = await getPayloadClient();
    const userInDb = await payload.findByID({
      collection: "customers",
      id: user.id,
    });
    if (!userInDb)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: USER_MESSAGE.NOT_FOUND,
      });
    return next({ ctx: { user: userInDb } });
  } catch (error) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: USER_MESSAGE.NOT_FOUND,
    });
  }
});

const UserRouter = router({
  addNewPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: add middleware for this
      const { user } = ctx;
      const { phoneNumber } = input;
      // to make sure have actual user
      try {

      const payload = await getPayloadClient();

      // with the same phoneNumber
      const isTheSamePhoneNumber = user.phoneNumbers?.find(
        (number) => number.phoneNumber === phoneNumber
      );
      if (isTheSamePhoneNumber)
        throw new TRPCError({
          code: "CONFLICT",
          message: PHONE_NUMBER_MESSAGE.CONFLICT,
        });

        await payload.update({
          collection: "customers",
          where: {
            id: { equals: user.id },
          },
          data: {
            phoneNumbers: user.phoneNumbers?.length
              ? [...user.phoneNumbers, { isDefault: false, phoneNumber }]
              : [{ isDefault: true, phoneNumber }],
          },
        });
        return {
          success: true,
          message: PHONE_NUMBER_MESSAGE.SUCCESS,
        };
      } catch (error) {
       throw error
      }
    }),
  changeUserName: getUserProcedure
    .input(SignUpCredentialSchema.pick({ name: true }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { name } = input;
      // to make sure have actual user
      try {

      const payload = await getPayloadClient();
      if (name === user.name)
        return { success: true, message: NAME_MESSAGE.UPDATE_SUCCESSFULLY };
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            name,
          },
        });
        return { success: true, message: NAME_MESSAGE.UPDATE_SUCCESSFULLY };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  setDefaultPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { phoneNumber, id } = input;
      // to make sure have actual user
      try {

      const payload = await getPayloadClient();

      const phoneNumberUpdatedToDefault = user.phoneNumbers?.find(
        (number) => number.id === id
      );
      if (!phoneNumberUpdatedToDefault || phoneNumberUpdatedToDefault.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: PHONE_NUMBER_MESSAGE.CANT_SET_DEFAULT,
        });
      const updatedToDefault = user.phoneNumbers?.map((number) =>
        number.id === id
          ? { ...number, isDefault: true }
          : { ...number, isDefault: false }
      );
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            phoneNumbers: updatedToDefault,
          },
        });
        return {
          success: true,
          message: PHONE_NUMBER_MESSAGE.SET_DEFAULT_SUCCESSFULLY,
        };
      } catch (error) {
        throw error
      }
    }),
  changeUserPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { phoneNumber, id } = input;
      // to make sure have actual user
      try {

      const payload = await getPayloadClient();
      const isTryingModifySameNumber =
        user.phoneNumbers?.find((phone) => phone.id === id)?.phoneNumber ===
        phoneNumber;
      if (isTryingModifySameNumber) return;
        const updatedPhoneNumbers = user.phoneNumbers?.map((phone) =>
          phone.id === id ? { ...phone, phoneNumber } : phone
        );
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            phoneNumbers: updatedPhoneNumbers,
          },
        });
        return {
          success: true,
          message: PHONE_NUMBER_MESSAGE.UPDATE_SUCCESSFULLY,
        };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  deletePhoneNumber: getUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      // to make sure have actual user
      try {

      const payload = await getPayloadClient();

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: USER_MESSAGE.NOT_FOUND,
        });

      const doesPhoneNumberExist = user.phoneNumbers?.find(
        (number) => number.id === id
      );
      if (!doesPhoneNumberExist)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: PHONE_NUMBER_MESSAGE.CANT_DELETE,
        });
      // if is the defaultNumber can't delete
      if (doesPhoneNumberExist.isDefault) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: PHONE_NUMBER_MESSAGE.CANT_DELETE,
        });
      }
      const updatedPhoneNumbers = user.phoneNumbers?.filter(
        (number) => number.id !== id
      );
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            phoneNumbers: updatedPhoneNumbers,
          },
        });
        return {
          deletedPhoneNumber: doesPhoneNumberExist.phoneNumber,
          success: true,
          message: `Xóa số điện thoại 
            ${doesPhoneNumberExist.phoneNumber}
           thành công`,
        };
      } catch (error) {
        throw error
      }
    }),
  addNewAddress: getUserProcedure
    .input(AddressValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: add middleware for this
      const { user } = ctx;
      const { district, street, ward, name, phoneNumber } = input;
      // to make sure have actual user
      try {

      const payload = await getPayloadClient();

      // with the same address
      const isTheSameAddress = user.address?.find(
        (ad) =>
          ad.district === district &&
          ad.ward === ward &&
          ad.street === street &&
          ad.phoneNumber === phoneNumber &&
          ad.name === name
      );
      if (isTheSameAddress)
        throw new TRPCError({
          code: "CONFLICT",
          message: ADDRESS_MESSAGE.CONFLICT,
        });

      const {docs:userResult}=  await payload.update({
          collection: "customers",
          where: {
            id: { equals: user.id },
          },
          data: {
            address: user.address?.length
              ? [
                  ...user.address,
                  {
                    isDefault: false,
                    district,
                    street,
                    ward,
                    phoneNumber,
                    name,
                  },
                ]
              : [
                  {
                    isDefault: true,
                    district,
                    street,
                    ward,
                    phoneNumber,
                    name,
                  },
                ],
          },
        });
        const userAddresses=userResult[0].address

        return { success: true, message: ADDRESS_MESSAGE.SUCCESS ,userAddresses};
      } catch (error) {
        throw error
      }
    }),
  setDefaultAddress: getUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      // to make sure have actual user
      try {

      const payload = await getPayloadClient();

      const addressUpdateToDefault = user.address?.find((ad) => ad.id === id);
      if (!addressUpdateToDefault || addressUpdateToDefault.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: ADDRESS_MESSAGE.CANT_SET_DEFAULT,
        });

      const updatedToDefault = user.address?.map((ad) =>
        ad.id === id ? { ...ad, isDefault: true } : { ...ad, isDefault: false }
      );
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            address: updatedToDefault,
          },
        });
        return {
          success: true,
          message: ADDRESS_MESSAGE.SET_DEFAULT_SUCCESSFULLY,
        };
      } catch (error) {
        throw error
      }
    }),
  adjustUserAddress: getUserProcedure
    .input(AddressValidationSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id, ward, district, street, phoneNumber, name } = input;
      // to make sure have actual user
      try {

      const payload = await getPayloadClient();

      const existingAddress = user.address?.find((ad) => ad.id === id);
      if (!existingAddress)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: ADDRESS_MESSAGE.CANT_UPDATE,
        });
      const isTheSameAddress = user.address?.find(
        (ad) =>
          ad.district === district &&
          ad.ward === ward &&
          ad.street === street &&
          ad.phoneNumber === phoneNumber &&
          ad.name === name
      );

      // TODO: THINK IF SHOULD NOTIFY USER OR NOT
      if (isTheSameAddress)
        return { success: true, message: ADDRESS_MESSAGE.UPDATE_SUCCESSFULLY };
      const updatedAddress = user.address?.map((ad) =>
        ad.id === id
          ? { ...ad, ward, district, street, name, phoneNumber }
          : { ...ad }
      );
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            address: updatedAddress,
          },
        });
        return {
          success: true,
          message: ADDRESS_MESSAGE.UPDATE_SUCCESSFULLY,
        };
      } catch (error) {
        throw error
      }
    }),
  deleteAddress: getUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      // to make sure have actual user
      try {

      const payload = await getPayloadClient();

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: USER_MESSAGE.NOT_FOUND,
        });

      const doesAddressExist = user.address?.find((ad) => ad.id === id);
      if (!doesAddressExist || doesAddressExist.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: ADDRESS_MESSAGE.CANT_DELETE,
        });
      // do not allow to delete default Address
      if (doesAddressExist.isDefault)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ADDRESS_MESSAGE.CANT_DELETE,
        });
      const updatedAddress = user.address?.filter((ad) => ad.id !== id);
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            address: updatedAddress,
          },
        });
        return {
          success: true,
          message: ADDRESS_MESSAGE.DELETE_SUCCESSFULLY,
        };
      } catch (error) {
       throw error
      }
    }),
  setUserCart: getUserProcedure
    .input(z.array(CartItemSchema))
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      try {

      const payload = await getPayloadClient();
      const updatedCart: CartItems = input;
      // TODO: should i extend with the existing one or simply replace it
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            cart: {
              items: updatedCart,
            },
          },
        });
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
});

export default UserRouter;
