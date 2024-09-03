import { DropdownList, DropdownListProps } from "./DropdownList";
import { render,fireEvent, within } from "@testing-library/react";

// import { act } from 'react';

// import { act } from 'react-dom/test-utils';

const labels = {
  hide: "Hide",
  show: "Show",
};

const data = [
  { value: "1", label: "Item 1" },
  { value: "2", label: "Item 2" },
  { value: "3", label: "Item 3" },
];

const makeSut = (props: Partial<DropdownListProps>) => {
  return render(
    <DropdownList
      data={data}
      labels={labels}
      onRemoveItem={jest.fn()}
      {...props}
    />
  );
};

describe("<DropdownList />", () => {
  test("Should not render ul component on initial render", () => {
    const { container } = makeSut({});

    expect(container.querySelector("ul")).not.toBeInTheDocument();
  });

  /**
   * TODO: Write test case for the following cases
   * Check if list is visible after one click on the button
   * Check if button labels are changing
   * Check if all items have been rendered correctly
   * Check if the remove callback is being called with correct values
   */
  
  test("Should render ul component when click on button", () => {
    const { getByText, queryByRole } = makeSut({});
    const button = getByText(labels.show);
    fireEvent.click(button);
    expect(queryByRole("list")).toBeInTheDocument();
  });

  test("Should switch button label on click", () => {
    const { getByText } = makeSut({});
    const button = getByText(labels.show);
    fireEvent.click(button);
    expect(button).toHaveTextContent(labels.hide);
  });

  test("Should render 3 li correctly", () => {
    const { getByText } = makeSut({});
    const button = getByText(labels.show);
    fireEvent.click(button);
    data.forEach(item => {
      expect(getByText(item.label)).toBeInTheDocument();
    });
  });

  // test("Should call onRemoveItem callback correctly", () => {
  //   const onRemoveItemMock = jest.fn();
  //   const { getByText } = makeSut({ onRemoveItem: onRemoveItemMock });
  //   const button = getByText(labels.show);
  //   fireEvent.click(button);
  //   data.forEach(item => {
  //     const removeButton = getByText(`Remove ${item.label}`);
  //     fireEvent.click(removeButton);
  //     expect(onRemoveItemMock).toHaveBeenCalledWith(item.value);
  //   });
  // });
  test("Should call onRemoveItem callback correctly", () => {
    const onRemoveItemMock = jest.fn();
    const { getByText, getAllByTestId } = makeSut({ onRemoveItem: onRemoveItemMock });
    const button = getByText(labels.show);
    fireEvent.click(button);
  
    const listItems = getAllByTestId(/^dropdown-li-/); // Get all list items
  
    listItems.forEach((li, index) => {
      const removeButton = within(li).getByText("Remove"); // Search for "Remove" button within each list item
      fireEvent.click(removeButton);
      // expect(onRemoveItemMock).toHaveBeenCalledWith(data[index].value);
      expect(onRemoveItemMock).toHaveBeenCalledWith(data[index], index);

    });
  });
});
