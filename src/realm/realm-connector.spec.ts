/*import { TestResult } from '@jest/types';
import { read } from 'fs';
import RealmDB from './index';
import formSchemas from './testSchema';

const path = undefined;

const forms = [{
    name: 'forms',
    properties: {
        _id: 'objectId',
        _partitionKey: 'string',
        active: 'bool?',
        collection: 'string?',
        created_at: 'date?',
        created_by: 'objectId?',
        deleted_at: 'date?',
        status: 'string?',
        updated_at: 'date?',
    },
    primaryKey: '_id',
}];
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5EUkJSRVUxTXpCRVF6STRNRGd6T1RCRU1EZ3hOVGRFTlROR1JUazNORU0xTnpJeE16STROZyJ9.eyJodHRwOi8vd3d3LmdyYWluY2hhaW4uaW8vcm9sZXMiOlsiU2lsb3N5cy1Vc2VyIl0sImZhbWlseV9uYW1lIjoiTW9udGVzaW5vcyIsIm5pY2tuYW1lIjoiY21vbnRlc2lub3MyMSIsIm5hbWUiOiJJdmFuIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzU3ZWY4YjFkYmFhYmM5MjMyNDc5NWEwODc0NjdiYzlhP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGaXYucG5nIiwidXBkYXRlZF9hdCI6IjIwMjItMDQtMjVUMTk6MTA6MDguMjEyWiIsImVtYWlsIjoiY21vbnRlc2lub3MyMUBncmFpbmNoYWluLmRldiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2dyYWluY2hhaW5kZXYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYyMjc2NDBlNTk2MjgyMDA2ODdmYzNlYSIsImF1ZCI6ImY5anc5eHNMMlNqZTJMd0hzRVpTeG5wTXVwSDBRaU5KIiwiaWF0IjoxNjUwOTEzODA4LCJleHAiOjE2NTA5NDk4MDh9.o05NTnlNWZDv3uj0DXjQBIsGiMaHC14F5jrl6Xf3s45csFUvyx2rtRWzDcPGlRKhajAGJPNYFd9ftnpqTHOnROmkxXY4YRGJhOmuHVnP-pY4bFO0Vbioyu_f-dkIsH9wqFFnJRjeI_bh1f-iAAbJBDbDJo2_xMdZSSJQBqdCZ8-HzNp1wOISsaieZ5SeWOzmHqq_woI6LYWJkRBG2XMYPwzrp3Fw451fSVgBESxLcR5kKR17lDcLH0nY9-5-6FCmgCH2ZjjZeRMTH0gFiUjnK5fzU0j-NQUwnprPXkpKOIxGzKJo2gGk7xExM9E7tTNVVfyco9AZcE277pW87R7WlQ';

// test('Test Connection with local schema', async () => {
//     let arraySchemas= Object.entries(forms).map((e) => ( e[1] ));

//    let testRealm =  new RealmDB({ path: path, realm_app_id: 'mngm-grainchain-crm-dev-wcejp', schemas: arraySchemas, 
//     token, debug:true,
//     partition_keys: ['partition_key=test'] });
//     let realmConn = await testRealm.signIn();
//     expect(await testRealm.open(realmConn)).toBe(true);
//     await testRealm.close()
//     await realmConn.currentUser.logOut();
//     realmConn = undefined;
//     testRealm = undefined;
//   });


test('Test Connection with local schema', async () => {
    let arraySchemas= Object.entries(forms).map((e) => ( e[1] ));

  let testRealm = new RealmDB({
    path: path,
    realm_app_id: 'mngm-grainchain-crm-dev-wcejp',
    schemas: arraySchemas, 
    token,
    debug: true,
    partition_keys: ['partition_key=test']
  });

  let realmConn = await testRealm.signIn();
  expect(await testRealm.open({ realmConn })).toBe(true);
  console.log(testRealm?.getOneRealmApp());
  await testRealm.close()
  await realmConn.currentUser.logOut();
  realmConn = undefined;
  testRealm = undefined;  
  });



  test('Test Connection with wrong parameters', async () => {
    let arraySchemas= Object.entries(forms).map((e) => ( e[1] ));

   let testRealm =  new RealmDB({ path: path, realm_app_id: 'mngm-grainchain-crm-dev-wcejp', schemas: arraySchemas, 
    token: 'faketoken', 
    partition_keys: ['partition_key=fake'] });
    expect(await testRealm.open()).toBe(false);
    await testRealm.close()
  });



  test('Test Connection with ts schema', async () => {
    let arraySchemas= formSchemas

   let testRealm =  new RealmDB({ path: path, realm_app_id: 'mngm-grainchain-crm-dev-wcejp', schemas: arraySchemas, 
    token,
    partition_keys: ['partition_key=test'] });
    expect(await testRealm.open()).toBe(true);    
    await testRealm.close()
  });
*/