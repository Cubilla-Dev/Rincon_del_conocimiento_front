export function MultiLineInput({ items, setItems, placeholderTemplate, addButtonText, fieldName }) {
  const addNewItem = () => {
    setItems([
      ...items,
      { [fieldName]: "", order: items.length + 1 }
    ]);
  };

  const updateItem = (index, newValue) => {
    const newItems = [...items];
    newItems[index][fieldName] = newValue;
    setItems(newItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={item[fieldName]}
            onInput={(e) => updateItem(index, e.target.value)}
            placeholder={placeholderTemplate.replace('{order}', item.order)}
          />
        </div>
      ))}
      <button type="button" onClick={addNewItem}>{addButtonText}</button>
    </div>
  );
}