const saveMessages = (): void => {
    localStorage.setItem('messages', JSON.stringify(messages));
}

const overrideMessage = (): void => {
    let index = messages.indexOf(
        messages.filter((message) => message?.title === activeMessage.title)[0]
    );

    index != -1 ? messages[index] = activeMessage : messages.push(activeMessage);
}

const bindValuesToMessage = (): Message => {
    let message = new Message("", "", ContactType.PRIVATE, MessageCategory.OTHER,
        "", "", MessageStatus.NOT_SENT);

    message.fullName = inputValue("fullName");
    message.emailAddress = inputValue("email");
    message.title = inputValue("messageTitle");
    message.content = inputValue("messageContent");

    const category = (document.getElementById("category") as HTMLSelectElement)?.value;
    message = setEnumValueInMessage(message, category, "MessageCategory");

    const contactType = (document.querySelector("input[name=contactType]:checked") as HTMLInputElement)?.value;
    message = setEnumValueInMessage(message, contactType, "ContactType");

    return message;
}

const setEnumValueInMessage = (message: Message, value: string, enumName: string): Message => {
    let enumClass: any;

    switch (enumName) {
        case "ContactType":
            enumClass = ContactType;
            break;
        case "MessageCategory":
            enumClass = MessageCategory;
            break;
        case "MessageStatus":
            enumClass = MessageStatus;
            break;
        default:
            return message;
    }

    for (let enumKey in enumClass) {
        if (value === enumKey) {
            enumClass === MessageCategory ? message.category = enumClass[enumKey as keyof typeof enumClass] : "";
            enumClass === ContactType ? message.contactType = enumClass[enumKey as keyof typeof enumClass] : "";
            enumClass === MessageStatus ? message.status = enumClass[enumKey as keyof typeof enumClass] : "";
            break;
        }
    }

    return message;
}

const inputValue = (elementId: string): string => {
    const element = document.getElementById(elementId) as HTMLInputElement;

    return element?.value;
}

const setValueOfInput = (inputName: string, value: string): void => {
    let input=
        document.querySelector('input[name=' + inputName + ']') as HTMLInputElement;
    input.value = value;
}

const setValueOfTextArea = (inputName: string, value: string): void => {
    let textarea =
        document.querySelector('textarea[name=' + inputName + ']') as HTMLTextAreaElement;
    textarea.value = value;
}

const radioButtonCheckValue = (inputName: string, value: string): void => {
    let radioButton =
        document.querySelector('input[name=' + inputName + '][value=' + value + ']') as HTMLInputElement;
    radioButton.checked = true;
}

const selectOption = (selectName: string, value: string): void => {
    let selectOption =
        document.querySelector('select[name= ' + selectName + '] > option[value=' + value + ']') as HTMLOptionElement;
    selectOption.selected = true;
}

const saveMessageWithStatus = (status: MessageStatus): void => {
    loadMessagesFromLocalStorage();
    activeMessage = bindValuesToMessage();
    activeMessage.status = status;
    overrideMessage();
    saveMessages();
}

const validateForm = (): string => {
    if (activeMessage.fullName.trim() == "")
        return "Full name is empty";

    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!activeMessage.emailAddress.match(emailRegex))
        return "Email address is not valid";

    if (activeMessage.title.trim() == "")
        return "Message title is empty";

    if (activeMessage.content.trim() == "")
        return "Message content is empty";

    return "";
}

$(function () {
    $("#dialog").dialog({
        autoOpen: false,
        modal: true
    });

    $("#contact-form").on("submit", function (e) {
        let validateFormMessage = validateForm();

        if (validateFormMessage == "")
            return;

        $("#dialog").dialog("open").text(validateFormMessage);
        e.preventDefault();
    });
});