import styleMultiLinea from '../../styles/multiInput.module.css';

export function MultiLineInput({ items, setItems, placeholderTemplate, addButtonText, fieldName }) {
  const addNewItem = () => {
    setItems([...items, { [fieldName]: '', order: items.length + 1 }]);
  };

  const updateItem = (index, newValue) => {
    const capitalized = newValue.charAt(0).toUpperCase() + newValue.slice(1);
    const newItems = [...items];
    newItems[index][fieldName] = capitalized;
    setItems(newItems);
  };

  return (
    <div className={styleMultiLinea.multiInputContainer}>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={item[fieldName]}
            onInput={(e) => updateItem(index, e.target.value)}
            placeholder={placeholderTemplate.replace('{order}', item.order)}
            className={styleMultiLinea.input}
          />
        </div>
      ))}
      <div className={styleMultiLinea.buttonContainer}>
        <button type="button" className={styleMultiLinea.button} onClick={addNewItem}>
          {addButtonText}
        </button>
      </div>
    </div>
  );
}
