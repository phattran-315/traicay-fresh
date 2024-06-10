import { formUserAddress } from "../../utils/util.utls";
import { getPayloadClient } from "../get-client-payload";
export const seedDb = async () => {
  try {
    console.log("SEEDING...");
    const payload = await getPayloadClient();
    console.log("DELETING...");
    const CustomerPhoneNumberModel =
      payload.db.collections["customer-phone-number"];
    const CustomerModel = payload.db.collections["customers"];
    const OrderModal = payload.db.collections["orders"];
    await CustomerPhoneNumberModel.deleteMany();
    await CustomerModel.deleteMany();
    await OrderModal.deleteMany();

    console.log("CREATING....");

    await payload.create({
      collection: "customers",
      data: {
        email: "testuser1@gmail.com",
        password: "test12345",
        name: "Phat",
        _verified: true,
      },
    });

    await payload.create({
      collection: "customer-phone-number",
      data: {
        phoneNumber: "0386325681",
        phoneNumbers: [{ phoneNumber: "0386325681", isDefault: true }],
      },
    });

    // user with cart items
    await payload.create({
      collection: "customers",
      data: {
        email: "testUserCart@gmail.com",
        password: "test12345",
        name: "Phat",
        _verified: true,
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3},
          ],
        },
        // cart for later
      },
    });

    await payload.create({
      collection: "customer-phone-number",
      data: {
        phoneNumber: "0985215845",
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3},
          ],
        },
        // cart for later
      },
    });

    // user with cart items and address
    // email
    await payload.create({
      collection: "customers",
      data: {
        email: "testUsercheckout@gmail.com",
        password: "test12345",
        name: "Phat",
        _verified: true,
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3},
          ],
        },
        address: [
          {
            isDefault: true,
            district: "Thành Phố Thủ Đức 1",
            ward: "Phường Linh Tây",
            name: "Phat",
            phoneNumber: "0352769981",
            street: "42 duong so 8",
          },
        ],
        // cart for later
      },
    });

    // phone number
    await payload.create({
      collection: "customer-phone-number",
      data: {
        phoneNumber: "0352769981",

        address: [
          {
            isDefault: true,
            district: "Thành Phố Thủ Đức 1",
            ward: "Phường Linh Tây",
            name: "Phat Tran",
            phoneNumber: "0352769981",
            street: "42 duong so 8",
          },
        ],
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3},
          ],
        },
        // cart for later
      },
    });

    // ORDERS
    //  can't use above document because i set the clearUserCartHook
    //create SUCCESS ORDERS (ORDER BY CASH) EMAIL

    const orderUserEmail = await payload.create({
      collection: "customers",
      data: {
        email: "testUserOrder@gmail.com",
        password: "test12345",
        name: "Phat",
        _verified: true,
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
          ],
        },
        address: [
          {
            isDefault: true,
            district: "Thành Phố Thủ Đức 1",
            ward: "Phường Linh Tây",
            name: "Phat",
            phoneNumber: "0352769981",
            street: "42 duong so 8",
          },
        ],
      },
    });
    // --FAIL--
// // CREATE FAILED ORDER
await payload.create({
  collection: "orders",
  data: {
    // @ts-ignore
    _id: "662d0b7a97b7d0c8cfd50e1e",
    shippingAddress: {
      address: formUserAddress({
        street: orderUserEmail!.address![0]!.street,
        ward: orderUserEmail!.address![0]!.ward,
        district: orderUserEmail!.address![0]!.district,
      }),
      userName: orderUserEmail!.address![0]!.name,
      userPhoneNumber: orderUserEmail!.address![0]!.phoneNumber,
    },

    total: 486000,
    _isPaid: false,
   provisional: 486000,
    shippingFee:0,
    deliveryStatus: "canceled",
    paymentMethod: "momo",
    status: "failed",
    orderNotes: "Giao trước 14h",
    // 4.5 kg mangosteens and 3 kg durian
    items: [
      { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
      { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
    ],
    orderBy: { relationTo: "customers", value: orderUserEmail.id },
  },
});
    // END ---FAIL---
  
   // create CANCELED ORDERS
   await payload.create({
    collection: "orders",
    data: {
      // @ts-ignore
      _id: "662d058a75cd684035a9e0d0",
      shippingAddress: {
        address: formUserAddress({
          street: orderUserEmail!.address![0]!.street,
          ward: orderUserEmail!.address![0]!.ward,
          district: orderUserEmail!.address![0]!.district,
        }),
        userName: orderUserEmail!.address![0]!.name,
        userPhoneNumber: orderUserEmail!.address![0]!.phoneNumber,
      },

      total: 486000,
      _isPaid: false,
      deliveryStatus: "canceled",
     provisional: 486000,

      paymentMethod: "cash",
      status: "canceled",
      orderNotes: "Giao trước 14h",
      // 4.5 kg mangosteens and 3 kg durian
      items: [
        { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
        { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
      ],
      orderBy: { relationTo: "customers", value: orderUserEmail.id },
    },
  });
//  --END CANCEL--

  // ---3 PENDING ORDERS 1 CANCELED ORDER---
  // 2 products with coupon code
  const orderUserEmailPendingOrder= await payload.create({
    collection: "customers",
    data: {
      email: "testUserOrderWithPendingOrders@gmail.com",
      password: "test12345",
      name: "Phat",
      _verified: true,
      cart: {
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
        ],
      },
      address: [
        {
          isDefault: true,
          district: "Thành Phố Thủ Đức 1",
          ward: "Phường Linh Tây",
          name: "Phat",
          phoneNumber: "0352769981",
          street: "42 duong so 8",
        },
      ],
    },
  });
  await payload.create({
    collection: "orders",
    data: {
      // @ts-ignore
      _id: "662bb02771b2f125b0b807e2",
      shippingAddress: {
        address: formUserAddress({
          street: orderUserEmailPendingOrder!.address![0]!.street,
          ward: orderUserEmailPendingOrder!.address![0]!.ward,
          district: orderUserEmailPendingOrder!.address![0]!.district,
        }),
        userName: orderUserEmailPendingOrder!.address![0]!.name,
        userPhoneNumber: orderUserEmailPendingOrder!.address![0]!.phoneNumber,
      },
      shippingFee:50000,
      total: 194000,
      _isPaid: false,
      totalAfterCoupon:144000,
      deliveryStatus: "canceled",
      createdAt:"2024-05-01T08:59:05.139+00:00",
      paymentMethod: "cash",
      status: "canceled",
     provisional: 160000,
      orderNotes: "Giao trước 14h",
      // 4.5 kg mangosteens and 3 kg durian
      items: [
        { product: "660e7631eec6f5aff6b5b77c", quantity: 1,price:80000 },
        { product: "660eb9f0bd794879d4c85358", quantity: 2 ,price:40000,originalPrice:45000},
      ],
      orderBy: { relationTo: "customers", value: orderUserEmailPendingOrder.id },
    },
  });
  await payload.create({
    collection: "orders",
    data: {
      // @ts-ignore
      _id: "662bb02771b2f125b0b807a5",
      shippingAddress: {
        address: formUserAddress({
          street: orderUserEmailPendingOrder!.address![0]!.street,
          ward: orderUserEmailPendingOrder!.address![0]!.ward,
          district: orderUserEmailPendingOrder!.address![0]!.district,
        }),
        userName: orderUserEmailPendingOrder!.address![0]!.name,
        userPhoneNumber: orderUserEmailPendingOrder!.address![0]!.phoneNumber,
      },
      shippingFee:50000,
      total: 194000,
      _isPaid: false,
      totalAfterCoupon:144000,
      deliveryStatus: "pending",
      createdAt:"2024-05-01T08:59:05.139+00:00",
      
      paymentMethod: "cash",
      status: "pending",
     provisional: 160000,
      orderNotes: "Giao trước 14h",
      // 4.5 kg mangosteens and 3 kg durian
      items: [
        { product: "660e7631eec6f5aff6b5b77c", quantity: 1,price:80000 },
        { product: "660eb9f0bd794879d4c85358", quantity: 2 ,price:40000,originalPrice:45000},
      ],
      orderBy: { relationTo: "customers", value: orderUserEmailPendingOrder.id },
    },
  });
  // 1 have discount in price
  await payload.create({
    collection: "orders",
    data: {
      // @ts-ignore
      _id: "662bb02771b2f125b0b807c1",
      shippingAddress: {
        address: formUserAddress({
          street: orderUserEmailPendingOrder!.address![0]!.street,
          ward: orderUserEmailPendingOrder!.address![0]!.ward,
          district: orderUserEmailPendingOrder!.address![0]!.district,
        }),
        userName: orderUserEmailPendingOrder!.address![0]!.name,
        userPhoneNumber: orderUserEmailPendingOrder!.address![0]!.phoneNumber,
      },
      shippingFee:50000,
      total: 210000,
      _isPaid: false,
      deliveryStatus: "pending",
      paymentMethod: "cash",
      createdAt:"2024-05-01T08:59:05.139+00:00",

      status: "pending",
     provisional: 160000,
      orderNotes: "Giao trước 14h",
      // 4.5 kg mangosteens and 3 kg durian
      items: [
        { product: "660e7631eec6f5aff6b5b77c", quantity: 1,price:80000 },
        { product: "660eb9f0bd794879d4c85358", quantity: 2 ,price:40000,originalPrice:45000},
      ],
      orderBy: { relationTo: "customers", value: orderUserEmailPendingOrder.id },
    },
  });
  //1 have no discount 
  await payload.create({
    collection: "orders",
    data: {
      // @ts-ignore
      _id: "662bb02771b2f125b0b807d3",
      shippingAddress: {
        address: formUserAddress({
          street: orderUserEmailPendingOrder!.address![0]!.street,
          ward: orderUserEmailPendingOrder!.address![0]!.ward,
          district: orderUserEmailPendingOrder!.address![0]!.district,
        }),
        userName: orderUserEmailPendingOrder!.address![0]!.name,
        userPhoneNumber: orderUserEmailPendingOrder!.address![0]!.phoneNumber,
      },
      shippingFee:50000,
      total: 210000,
      _isPaid: false,
      deliveryStatus: "pending",
      paymentMethod: "cash",
      status: "pending",
      createdAt:"2024-05-01T08:59:05.139+00:00",

     provisional: 160000,
      orderNotes: "Giao trước 14h",
      // 4.5 kg mangosteens and 3 kg durian
      items: [
        { product: "660e7631eec6f5aff6b5b77c", quantity: 2,price:80000 },
        // { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
      ],
      orderBy: { relationTo: "customers", value: orderUserEmailPendingOrder.id },
    },
  });

  // ---END PENDING ORDERS-----


    // --END USER EMAIL
    //create SUCCESS ORDERS (ORDER BY CASH) PHONE NUMBER
    const orderUserPhoneNumber = await payload.create({
      collection: "customer-phone-number",
      data: {
        phoneNumber: "0988139978",

        address: [
          {
            isDefault: true,
            district: "Thành Phố Thủ Đức 1",
            ward: "Phường Linh Tây",
            name: "Phat Tran",
            phoneNumber: "0352769981",
            street: "42 duong so 8",
          },
        ],
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
          ],
        },
      },
    });

    await payload.create({
      collection: "orders",
      data: {
        shippingAddress: {
          address: formUserAddress({
            street: orderUserPhoneNumber!.address![0]!.street,
            ward: orderUserPhoneNumber!.address![0]!.ward,
            district: orderUserPhoneNumber!.address![0]!.district,
          }),
          userName: orderUserPhoneNumber!.address![0]!.name,
          userPhoneNumber: orderUserPhoneNumber!.address![0]!.phoneNumber,
        },

        total: 468000,
        _isPaid: false,
        shippingFee:0,
        deliveryStatus: "pending",
        paymentMethod: "cash",
      createdAt:"2024-05-01T08:59:05.139+00:00",

        provisional:468000,
        status: "pending",
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
        ],
        orderBy: {
          relationTo: "customer-phone-number",
          value: orderUserPhoneNumber.id,
        },
      },
    });
    // // 662d058a75cd684035a9e0d0

 

    // // phoneNumber

    await payload.create({
      collection: "orders",
      data: {
        shippingAddress: {
          address: formUserAddress({
            street: orderUserPhoneNumber!.address![0]!.street,
            ward: orderUserPhoneNumber!.address![0]!.ward,
            district: orderUserPhoneNumber!.address![0]!.district,
          }),
          userName: orderUserPhoneNumber!.address![0]!.name,
          userPhoneNumber: orderUserPhoneNumber!.address![0]!.phoneNumber,
        },
        shippingFee:0,
        total: 468000,
       provisional: 468000,

        _isPaid: false,
        deliveryStatus: "canceled",
        paymentMethod: "cash",
        status: "canceled",
      createdAt:"2024-05-01T08:59:05.139+00:00",

        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
        ],
        orderBy: {
          relationTo: "customer-phone-number",
          value: orderUserPhoneNumber.id,
        },
      },
    });
    // // 662d0b7a97b7d0c8cfd50e1e

   

    await payload.create({
      collection: "orders",
      data: {
        shippingAddress: {
          address: formUserAddress({
            street: orderUserPhoneNumber!.address![0]!.street,
            ward: orderUserPhoneNumber!.address![0]!.ward,
            district: orderUserPhoneNumber!.address![0]!.district,
          }),
          userName: orderUserPhoneNumber!.address![0]!.name,
          userPhoneNumber: orderUserPhoneNumber!.address![0]!.phoneNumber,
        },
        shippingFee:0,
        provisional:468000,
        total: 468000,
        _isPaid: false,
        deliveryStatus: "canceled",
        paymentMethod: "cash",
        status: "failed",
        orderNotes: "Giao trước 14h",
      createdAt:"2024-05-01T08:59:05.139+00:00",

        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
        ],
        orderBy: {
          relationTo: "customer-phone-number",
          value: orderUserPhoneNumber.id,
        },
      },
    });



    // 3 ENDING ORDERS 1 canceled order

    const orderUserPhoneNumberPendingOrders = await payload.create({
      collection: "customer-phone-number",
      data: {
        phoneNumber: "0985215844",

        address: [
          {
            isDefault: true,
            district: "Thành Phố Thủ Đức 1",
            ward: "Phường Linh Tây",
            name: "Phat Tran",
            phoneNumber: "0352769981",
            street: "42 duong so 8",
          },
        ],
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5,price:80000 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
          ],
        },
      },
    });
    // 
    await payload.create({
      collection: "orders",
      data: {
        // @ts-ignore
        _id: "662bb02771b2f125b0b807d4",
        shippingAddress: {
          address: formUserAddress({
            street: orderUserPhoneNumberPendingOrders!.address![0]!.street,
            ward: orderUserPhoneNumberPendingOrders!.address![0]!.ward,
            district: orderUserPhoneNumberPendingOrders!.address![0]!.district,
          }),
          userName: orderUserPhoneNumberPendingOrders!.address![0]!.name,
          userPhoneNumber: orderUserPhoneNumberPendingOrders!.address![0]!.phoneNumber,
        },
        shippingFee:50000,
        total: 194000,
        _isPaid: false,
        totalAfterCoupon:144000,
        deliveryStatus: "canceled",
      createdAt:"2024-05-01T08:59:05.139+00:00",
        
        paymentMethod: "cash",
        status: "canceled",
       provisional: 160000,
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 1,price:80000 },
          { product: "660eb9f0bd794879d4c85358", quantity: 2 ,price:40000,originalPrice:45000},
        ],
        orderBy: { relationTo: "customer-phone-number", value: orderUserPhoneNumberPendingOrders.id },
      },
    });
    await payload.create({
      collection: "orders",
      data: {
        // @ts-ignore
        _id: "662bb02771b2f125b0b807c3",
        shippingAddress: {
          address: formUserAddress({
            street: orderUserPhoneNumberPendingOrders!.address![0]!.street,
            ward: orderUserPhoneNumberPendingOrders!.address![0]!.ward,
            district: orderUserPhoneNumberPendingOrders!.address![0]!.district,
          }),
          userName: orderUserPhoneNumberPendingOrders!.address![0]!.name,
          userPhoneNumber: orderUserPhoneNumberPendingOrders!.address![0]!.phoneNumber,
        },
        shippingFee:50000,
        total: 194000,
        _isPaid: false,
        totalAfterCoupon:144000,
        deliveryStatus: "pending",
      createdAt:"2024-05-01T08:59:05.139+00:00",
        
        paymentMethod: "cash",
        status: "pending",
       provisional: 160000,
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 1,price:80000 },
          { product: "660eb9f0bd794879d4c85358", quantity: 2 ,price:40000,originalPrice:45000},
        ],
        orderBy: { relationTo: "customer-phone-number", value: orderUserPhoneNumberPendingOrders.id },
      },
    });
    // 1 have discount in price
    await payload.create({
      collection: "orders",
      data: {
        // @ts-ignore
        _id: "662bb02771b2f125b0b807a3",
        shippingAddress: {
          address: formUserAddress({
            street: orderUserPhoneNumberPendingOrders!.address![0]!.street,
            ward: orderUserPhoneNumberPendingOrders!.address![0]!.ward,
            district: orderUserPhoneNumberPendingOrders!.address![0]!.district,
          }),
          userName: orderUserPhoneNumberPendingOrders!.address![0]!.name,
          userPhoneNumber: orderUserPhoneNumberPendingOrders!.address![0]!.phoneNumber,
        },
        shippingFee:50000,
        total: 210000,
        _isPaid: false,
        deliveryStatus: "pending",
        paymentMethod: "cash",
      createdAt:"2024-05-01T08:59:05.139+00:00",

        status: "pending",
       provisional: 160000,
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 1,price:80000 },
          { product: "660eb9f0bd794879d4c85358", quantity: 2 ,price:40000,originalPrice:45000},
        ],
        orderBy: { relationTo: "customer-phone-number", value: orderUserPhoneNumberPendingOrders.id },
      },
    });
    //1 have no discount 
    await payload.create({
      collection: "orders",
      data: {
        // @ts-ignore
        _id: "662bb02771b2f125b0b807b3",
        shippingAddress: {
          address: formUserAddress({
            street: orderUserPhoneNumberPendingOrders!.address![0]!.street,
            ward: orderUserPhoneNumberPendingOrders!.address![0]!.ward,
            district: orderUserPhoneNumberPendingOrders!.address![0]!.district,
          }),
          userName: orderUserPhoneNumberPendingOrders!.address![0]!.name,
          userPhoneNumber: orderUserPhoneNumberPendingOrders!.address![0]!.phoneNumber,
        },
        shippingFee:50000,
        total: 210000,
        _isPaid: false,
      createdAt:"2024-05-01T08:59:05.139+00:00",

        deliveryStatus: "pending",
        paymentMethod: "cash",
        status: "pending",
       provisional: 160000,
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 2,price:80000 },
          // { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 ,price:42000},
        ],
        orderBy: { relationTo: "customer-phone-number", value: orderUserPhoneNumberPendingOrders.id },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
