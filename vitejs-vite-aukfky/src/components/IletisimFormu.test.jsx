import { afterEach, beforeEach, expect, test } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  findAllByTestId,
  queryAllByTestId,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';
import IletisimFormu from './IletisimFormu';

//eksik import buraya
//fixin tuzağı buraya? detaylar readme dosyasında.

beforeEach(() => {
  render(<IletisimFormu />);
});

test('[1] hata olmadan render ediliyor', () => {
  render(<IletisimFormu />);
});

test('[2] iletişim formu headerı render ediliyor', () => {
  //get by text ile h1 tagini yakalayın
  //to be in the document, to be truthy, to have text content ile kontrol edin.
  const header = screen.getByText('İletişim Formu');
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent('İletişim Formu');
});

test('[3] kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
  //get by label text ile name alanını yakalayınız
  const textLabel = screen.getByLabelText('Ad*');
  //find all by test id ile error mesajlarını yakalayın
  await userEvent.type(textLabel, 'Emir');
  const error = await screen.findAllByTestId('error');
  //to have length ile kontrol edin.
  expect(error).toHaveLength(1);
});

test('[4] kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
  //hiç bir alanı doldurmadan get by role ile butonu yakalayın
  const button = screen.getByRole('button', { name: /gönder/i });
  userEvent.click(button);
  //error mesajlarının to have lengthine bakarak kontrol edin
  const error = await screen.getAllByTestId('error');
  expect(error).toHaveLength(3);
});

test('[5] kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
  //get by test id ile input alanlarını yakalayın
  const nameInput = screen.getByTestId('name-input');
  const soyadINPUT = screen.getByTestId('lastName-input');

  await userEvent.type(nameInput, 'Emirkan');
  await userEvent.type(soyadINPUT, 'Ülker');

  const submitButton = screen.getByRole('button', { name: /gönder/i });
  await userEvent.click(submitButton);

  const error = await screen.getAllByTestId('error');
  expect(error).toHaveLength(1);
  //error mesajlarının to have lengthine bakarak kontrol edin
});

test('[6] geçersiz bir mail girildiğinde "Hata: email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const email = screen.getByTestId('email-input');
  await userEvent.type(email, 'aasd1ı213-gdfg12.-!é');

  const error = await screen.getByTestId('error');
  expect(error).toHaveTextContent(
    'Hata: email geçerli bir email adresi olmalıdır.'
  );
  //errorı get by test id ile yakalayın
  //to have text content ile hata metnini kontrol edin
});

test('[7] soyad girilmeden gönderilirse "Hata: soyad gereklidir." mesajı render ediliyor', async () => {
  //find by text ve to be in the document ile hata metni ekranda mı kontrol edin
  const name = screen.getByTestId('name-input');
  await userEvent.type(name, 'Emirkan');

  const button = screen.getByRole('button', { name: /gönder/i });
  await userEvent.click(button);

  const error = await screen.findByText('Hata: soyad gereklidir.');
  expect(error).toBeInTheDocument();
});

test('[8] ad, soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
  const name = screen.getByTestId('name-input');
  const soyadINPUT = screen.getByTestId('lastName-input');
  const email = screen.getByTestId('email-input');
  const submitButton = screen.getByRole('button', { name: /gönder/i });

  await userEvent.type(name, 'Emirkan');
  await userEvent.type(soyadINPUT, 'Ülker');
  await userEvent.type(email, 'emirkanülker@gmail.com');
  await userEvent.click(submitButton);

  const error = screen.queryAllByTestId('error');
  expect(error).toHaveLength(0);
});

test('[9] form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
  const name = screen.getByTestId('name-input');
  const soyadINPUT = screen.getByTestId('lastName-input');
  const email = screen.getByTestId('email-input');
  const submitButton = screen.getByRole('button', { name: /gönder/i });
  const message = screen.getByTestId('message-input');

  await userEvent.type(name, 'Emirkan');
  await userEvent.type(soyadINPUT, 'Ülker');
  await userEvent.type(email, 'emirkanülker@gmail.com');
  await userEvent.type(message, 'Part-prodan selamlar');
  await userEvent.click(submitButton);

  expect(screen.getByText('Emirkan')).toBeInTheDocument();
  expect(screen.getByText('Ülker')).toBeInTheDocument();
  expect(screen.getByText('emirkanülker@gmail.com')).toBeInTheDocument();
  expect(screen.getByText('Part-prodan selamlar')).toBeInTheDocument();
});

//

//

// BURADAN SONRASINA DOKUNMAYIN //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const testFile = fs
  .readFileSync(path.resolve(__dirname, './IletisimFormu.test.jsx'), 'utf8')
  .replaceAll(/(?:\r\n|\r|\n| )/g, '');
const tests = testFile.split("test('[");

test('Kontrol: IletisimFormu componenti import edilmiş.', async () => {
  expect(tests[0]).toContain('importIletisimFormufrom');
});

test('Kontrol: test[1] için render metodu kullanılmış', async () => {
  expect(tests[1]).toContain('render(<IletisimFormu');
});

test('Kontrol: test[2] için screen.getByText(...) kullanılmış', async () => {
  expect(tests[2]).toContain('screen.getByText(');
});

test('Kontrol: test[2] için .toBeInTheDocument() ile kontrol edilmiş', async () => {
  expect(tests[2]).toContain('.toBeInTheDocument()');
});

test('Kontrol: test[2] için .toBeTruthy() ile kontrol edilmiş', async () => {
  expect(tests[2]).toContain('.toBeTruthy()');
});

test('Kontrol: test[2] için .toHaveTextContent(...) ile kontrol edilmiş', async () => {
  expect(tests[2]).toContain('.toHaveTextContent(');
});

test('Kontrol: test[3] için screen.getByLabelText(...) kullanılmış', async () => {
  expect(tests[3]).toContain('screen.getByLabelText(');
});

test('Kontrol: test[3] için screen.findAllByTestId(...) kullanılmış', async () => {
  expect(tests[3]).toContain('screen.findAllByTestId(');
});

test('Kontrol: test[3] için findAllByTestId await ile kullanılmış', async () => {
  expect(tests[3]).toContain('awaitscreen.findAllByTestId');
});

test('Kontrol: test[3] için .toHaveLength(...) ile kontrol edilmiş', async () => {
  expect(tests[3]).toContain('.toHaveLength(1)');
});

test('Kontrol: test[4] için .getByRole(...) kullanılmış ', async () => {
  expect(tests[4]).toContain('screen.getByRole(');
});

test('Kontrol: test[4] için .toHaveLength(...) ile kontrol edilmiş', async () => {
  expect(tests[4]).toContain('.toHaveLength(3)');
});

test('Kontrol: test[5] için .getByTestId(...) kullanılmış', async () => {
  expect(tests[5]).toContain('screen.getByTestId(');
});

test('Kontrol: test[5] için .toHaveLength(...) ile kontrol edilmiş', async () => {
  expect(tests[5]).toContain('.toHaveLength(1)');
});

test('Kontrol: test[6] için .getByTestId(...) kullanılmış', async () => {
  expect(tests[6]).toContain('screen.getByTestId(');
});

test('Kontrol: test[6] için .toHaveTextContent(...) ile kontrol edilmiş', async () => {
  expect(tests[6]).toContain(').toHaveTextContent(');
});

test('Kontrol: test[7] için .findByText(...) await ile kullanılmış', async () => {
  expect(tests[7]).toContain('awaitscreen.findByText(');
});

test('Kontrol: test[7] için .toBeInTheDocument() ile kontrol edilmiş', async () => {
  expect(tests[7]).toContain(').toBeInTheDocument()');
});

test('Kontrol: tüm testlerde(test1 hariç) iletişim formu ayrı ayrı render edilmesi yerine beforeEach hooku kullılarak, render içinde yapılmış.', async () => {
  expect(tests[0]).toContain('beforeEach(()=>{');
  expect(tests[0]).toContain('render(<IletisimFormu/>)');
});
