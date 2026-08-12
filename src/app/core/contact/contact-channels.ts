/**
 * O e-mail estava escrito à mão em três lugares do template, uma vez como
 * `mailto:` e outra como texto visível. Trocar o endereço exigia lembrar de
 * todos, e o botão de copiar precisa do valor cru, sem a entidade `&#64;` que
 * os templates usam para escapar do control flow do Angular.
 */
export const CONTACT_EMAIL = 'augusto.almeida2@icloud.com';
