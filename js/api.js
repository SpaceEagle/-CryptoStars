const getDataUser = async(onSuccess, onFail) => {
  try {
    const response = await fetch('https://cryptostar.grading.pages.academy/user');
    if (!response.ok) {
      throw new Error('Не удалось загрузить Пользователя');
    }
    const data = await response.json();
    onSuccess(data);

  } catch (err) {
    onFail(err.message);
  }
};

const getDataContractors = async(onSuccess, onFail) => {
  try {
    const response = await fetch('https://cryptostar.grading.pages.academy/contractors');
    if (!response.ok) {
      throw new Error('Не удалось загрузить контрагентов');
    }
    const data = await response.json();
    onSuccess(data);

  } catch (err) {
    onFail(err.message);
  }
};

const sendData = async (onSuccess, onFail, body) => {
  try {
    const response = await fetch('https://cryptostar.grading.pages.academy/',
      {
        method: 'POST',
        body,
      }
    );
    if(!response.ok) {
      throw new Error ('Не удалось отправить форму. Попробуйте ещё раз');
    }
    onSuccess();

  } catch (err) {
    onFail(err);
  }
};

export {getDataUser, getDataContractors, sendData};
