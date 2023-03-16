import {isEscapeKey} from './util.js';

const contractorErrorMessage = document.querySelector('.contractor-error-message');
// const submitBtn = modalBuy.querySelector('.modal__submit');
// const successMessage = modalBuy.querySelector('.modal__validation-message--success');
// const errorMessage = modalBuy.querySelector('.modal__validation-message--error');

const onContractorErrorMessageEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeContractorErrorMessage();
  }
};

const onWindowcontractorErrorMessageClose = (evt) => {
  const contractorErrorContainer = contractorErrorMessage.querySelector('.message');
  if (evt.target.closest('.message') !== contractorErrorContainer) {
    closeContractorErrorMessage();
  }
};

const showContractorErrorMessage = () => {
  contractorErrorMessage.style.display = 'block';
  document.body.appendChild(contractorErrorMessage);
  document.addEventListener('keydown', onContractorErrorMessageEscKeydown);
  contractorErrorMessage.addEventListener('click', onWindowcontractorErrorMessageClose);
};

function closeContractorErrorMessage () {
  contractorErrorMessage.style.display = 'none';
  contractorErrorMessage.remove();
  document.removeEventListener('keydown', onContractorErrorMessageEscKeydown);
  contractorErrorMessage.removeEventListener('click', onWindowcontractorErrorMessageClose);
}

const resetMessageBlock = (formContainer) => {
  const successMessage = formContainer.querySelector('.modal__validation-message--success');
  const errorMessage = formContainer.querySelector('.modal__validation-message--error');
  if (!successMessage.classList.contains('visually-hidden')) {
    successMessage.classList.add('visually-hidden');
  }
  if (!errorMessage.classList.contains('visually-hidden')) {
    errorMessage.classList.add('visually-hidden');
  }
};

const showSubmitSuccessMessage = (form) => {
  const successMessage = form.querySelector('.modal__validation-message--success');
  successMessage.classList.remove('visually-hidden');
};

const showSubmitErrorMessage = (form) => {
  const errorMessage = form.querySelector('.modal__validation-message--error');
  errorMessage.classList.remove('visually-hidden');
};

export {showContractorErrorMessage, showSubmitSuccessMessage, showSubmitErrorMessage, resetMessageBlock};
