import { CiCirclePlus } from "react-icons/ci";
import FormInput from "./FormInput";
import { objectCreater } from "../utils/object-creater";

import { MdOutlineDelete } from "react-icons/md";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { validateInput } from "../utils/validateInput";

function CreateInvoie() {
  const drawerRef = useRef(null);
  const formRef = useRef(null);
  const [items, setItems] = useState([]);
  // const [invoiceData, setInvoiceData] = useState({});

  // discard button
  const handleDiscard = () => {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
    if (formRef.current) {
      formRef.current.reset();
    }
    setItems([]);
  };

  // add new item button
  const addNewItem = () => {
    setItems([...items, { id: Date.now(), name: "", qty: 1, price: 0 }]);
  };

  // remove icon
  const removeItem = (id, field, value) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              total:
                field === "qty" || field === "price"
                  ? field === "qty"
                    ? value * item.price
                    : item.qty * value
                  : item.total,
            }
          : item
      )
    );
  };

  async function getFormData(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData);
    const data = Object.fromEntries(formData.entries());

    const itemNames = formData.getAll("itemName");
    const quantities = formData.getAll("qty");
    const prices = formData.getAll("price");

    const items = itemNames.map((name, index) => ({
      name,
      quantity: Number(quantities[index]),
      price: Number(prices[index]),
      total: Number(prices[index]) * Number(quantities[index]),
    }));
    const submitter = e.nativeEvent.submitter;
    const status = submitter.dataset.status;

    const invoiceData = objectCreater({
      createdAt: new Date().toISOString().split("T")[0],
      paymentDue: data.invoiceDate,
      description: data.projectDescription,
      paymentTerms: data.paymentTerms,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      status,
      senderStreet: data.senderStreet,
      senderCity: data.senderCity,
      senderPostCode: data.senderPostCode,
      senderCountry: data.senderCountry,
      street: data.senderStreet,
      city: data.city,
      postCode: data.postCode,
      country: data.country,
      items,
    });

    const errors = validateInput(invoiceData);
    if (!errors) {
    } else {
      const { message, target } = errors;
      toast.error(message);
      e.target[target]?.focus();
      return;
    }
    // Validation

    // if (invoiceData.clientEmail == "") {
    //   return toast.error(" client email kiritilmadi !");
    // }

    // if (invoiceData.city.trim() == "") {
    //   return toast.error("City kiritilmadi");
    // }
    try {
      const response = await fetch("http://localhost:3000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error("Serverga ma'lumot yuborishda xatolik!");
      }

      const result = await response.json();
      console.log("Yangi data invoice :", result);
      drawerRef.current.checked = false;
    } catch (error) {
      console.error("Xatolik:", error);
    }
  }

  return (
    <div>
      <div className="drawer">
        <input
          ref={drawerRef}
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        <div className="drawer-content">
          <label
            htmlFor="my-drawer"
            className="btn bg-[#7C5DFA] hover:bg-[#6349ca] text-white rounded-full flex justify-between pl-2 pr-6 drawer-button "
          >
            <span className="rounded-full w-6 h-6 bg-white">
              <CiCirclePlus className="w-full h-full text-[#7C5DFA] font-bold" />
            </span>
            <p className=" flex gap-2">
              New <span className="hidden md:block">Invoice</span>
            </p>
          </label>
        </div>
        <form
          ref={formRef}
          onSubmit={getFormData}
          className="drawer-side md:ml-[103px]"
        >
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="list-a text-base-content h-full ">
            <div>
              <div className=" list-a p-6  ">
                <h1 className="text-2xl font-bold mb-6">New Invoice</h1>

                {/* Bill From */}
                <h2 className="text-purple-600 font-semibold mb-2">
                  Bill From
                </h2>
                <FormInput
                  name="senderStreet"
                  type="text"
                  placaholder="19 Union Terrace"
                  mainName="Street Address"
                />

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <FormInput
                    name="senderCity"
                    type="text"
                    placaholder="London"
                    mainName="City"
                  />

                  <FormInput
                    name="senderPostCode"
                    type="text"
                    placaholder="E1 3EZ"
                    mainName="Post Code"
                  />
                  <FormInput
                    name="senderCountry"
                    type="text"
                    placaholder="United Kingdom"
                    mainName="Country"
                  />
                </div>

                {/* Bill To */}
                <h2 className="text-purple-600 font-semibold mt-6 mb-2">
                  Bill To
                </h2>
                <FormInput
                  name="clientName"
                  type="text"
                  placaholder="Alex Grim"
                  mainName="Client’s Name"
                />
                <FormInput
                  name="clientEmail"
                  type="email"
                  placaholder="alexgrim@mail.com"
                  mainName="Clients Email"
                />
                <FormInput
                  name="streetAddress"
                  type="text"
                  placaholder="84 Church Way"
                  mainName="Street Address"
                />

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <FormInput
                    name="city"
                    type="text"
                    placaholder="Bradford"
                    mainName="City"
                  />
                  <FormInput
                    name="postCode"
                    type="text"
                    placaholder="BD1 9PB"
                    mainName="Post Code"
                  />
                  <FormInput
                    name="country"
                    type="text"
                    placaholder="United Kingdom"
                    mainName="Country"
                  />
                </div>

                {/* Invoice Date & Payment Terms */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <FormInput
                    name="invoiceDate"
                    type="date"
                    mainName="Invoice Date"
                  />
                  <FormInput
                    name="paymentTerms"
                    type="text"
                    placaholder="Net 30 Days"
                    mainName="Payment Terms"
                  />
                </div>

                <FormInput
                  name="projectDescription"
                  type="text"
                  placaholder="Graphic Design"
                  mainName="Project Description"
                />

                {/* Item List */}
                <h2 className="text-gray-600 font-semibold mt-6 mb-2">
                  Item List
                </h2>

                {items.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    Item qo‘shish uchun "Add New Item" tugmasini bosing
                  </p>
                ) : (
                  items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-row justify-between md:flex-row i   md:gap-2 items-center shadow-2xl  "
                    >
                      <div className="flex flex-col md:flex-row">
                        {" "}
                        <FormInput
                          mainName="Item Name"
                          className=" h-10 mb-2"
                          name="itemName"
                          type="text"
                          placeholder="Banner Design"
                          onChange={(e) => {
                            updateItem(item.id, "name", Number(e.target.value));
                          }}
                        />
                        <FormInput
                          mainName="Qty"
                          className=" h-10 mb-2"
                          name="qty"
                          type="number"
                          placeholder="1"
                          onChange={(e) => {
                            updateItem(item.id, "qty", Number(e.target.value));
                          }}
                        />
                        <FormInput
                          mainName="Price"
                          className=" h-10 mb-2"
                          name="price"
                          type="number"
                          placeholder="156.00"
                          onChange={(e) => {
                            updateItem(
                              item.id,
                              "price",
                              Number(e.target.value)
                            );
                          }}
                        />
                      </div>
                      <div className="flex">
                        <div className="flex flex-col  gap-2 items-center justify-between p-1">
                          <span className="text-xl font-bold p-2 w-16  overflow-y-scroll">
                            {(item.qty * item.price).toFixed(2)}$
                          </span>
                        </div>

                        <button>
                          <MdOutlineDelete
                            className="text-3xl cursor-pointer  ml-2"
                            onClick={() => removeItem(index)}
                          />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button
                  className="w-full btn-blue-bg py-2 mt-4 rounded-lg"
                  type="button"
                  onClick={addNewItem}
                >
                  + Add New Item
                </button>
              </div>
              {/* Buttons */}
              <div className="sticky bottom-0  btn-button left-0 p-8 w-full">
                <div className="flex justify-between mt-6">
                  <button
                    className="btn-bg py-2 px-6 rounded-lg btn-sm md:btn-md"
                    type="button"
                    onClick={handleDiscard}
                  >
                    Discard
                  </button>
                  <div className="flex gap-2">
                    <button
                      className="bg-gray-700 text-white py-2 px-6 rounded-lg   btn-sm md:btn-md"
                      type="submit"
                      data-status="draft"
                    >
                      Save as Draft
                    </button>
                    <button
                      className="bg-purple-600 text-white py-2 px-6 rounded-lg  btn-sm md:btn-md"
                      type="submit"
                      data-status="pending"
                    >
                      Save & Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar content  */}
          </ul>
        </form>
      </div>
    </div>
  );
}

export default CreateInvoie;
