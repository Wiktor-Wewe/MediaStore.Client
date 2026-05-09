export const ERROR_MESSAGES: Record<string, string> = {
  'Error.Product.Code.Required': 'Kod produktu jest wymagany.',
  'Error.Product.Code.MaxLength': 'Kod produktu może mieć maksymalnie 10 znaków.',
  'Error.Product.Code.AlreadyExists': 'Produkt o takim kodzie już istnieje.',
  'Error.Product.Name.Required': 'Nazwa produktu jest wymagana.',
  'Error.Product.Name.MaxLength': 'Nazwa produktu może mieć maksymalnie 100 znaków.',
  'Error.Product.Price.GreaterThanZero': 'Cena produktu musi być większa od 0.',

  'Error.Auth.InvalidCredentials': 'Nieprawidłowy email lub hasło.',
  'Error.Auth.User.NotActive': 'Konto nie zostało jeszcze aktywowane.',
  'Error.Auth.Registration.Disabled': 'Rejestracja jest obecnie wyłączona.',
};

export function translateError(code: string): string {
  return ERROR_MESSAGES[code] ?? code;
}
