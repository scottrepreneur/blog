---
template: post
title: Extending Next Hasura SIWE template with first model
draft: false
date: 2022-12-28T08:35:24.152Z
description: "Extending the Next Hasura SIWE template to demonstrate initial queries and mutations"
callToFeedback: "Let me know if you're interested in leveraging the Next Hasura SIWE template!"
category: "Dev"
tags:
  - siwe
  - hasura
  - nextjs
---

## Next Hasura SIWE Primer

This is a follow-up to my previous post on the [Next Hasura SIWE template](/posts/2022-08-16---Next-Hasura-SIWE-Template). In that post, I covered the basics of the template and how to get it up and running. In this post, I'll be extending the template to demonstrate how to add a new model and how to perform queries and mutations on that model.

## Adding a new model

The first thing we need to do is add a new model to our database. We'll be adding a `contracts` model to our database. To do this, we'll need to add a new migration file. To do this, we'll need to run the following command:

```bash
hasura migrate create add_contracts --from-server
```

This will create a new migration file in the `migrations` folder. We'll need to add the following to the `up` section of the migration file:

```sql
CREATE TABLE public.contracts (
    address text NOT NULL,
    name text NOT NULL,
    chain_id integer NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY ("address"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("address") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("address", "chain_id")
);
```

Next you can run this migration by running the following command:

```bash
npx hasura migrate apply
```

This will create a new table in our database called `contracts`. Hasura will see this new table and suggest tracking it. We can accept this updated tracking via the console and Hasura will add it to the metadata. The model is now accessible via the GraphQL API.

## Updating the queries and mutations

First we can add the new queries and mutations for the contract model.

`utils/gql/queries.ts`

```js
...

export const CONTRACT_LIST_QUERY = gql`
  query contractList {
    contracts {
      name
      address
      chain_id
    }
  }
`;

export const CONTRACT_DETAIL_QUERY = gql`
  query contractDetail($address: String) {
    contracts(where: { address: { _eq: $address } }) {
      name
      address
      chain_id
    }
  }
`;

export const CONTRACT_CREATE_MUTATION = gql`
  mutation createContract($contract: contracts_insert_input!) {
    insert_contracts(objects: [$contract]) {
      returning {
        name
        address
        chain_id
      }
    }
  }
`;
```

Then we can add some hooks to handle the data fetching and mutations.

`hooks/useContractList.ts`

```tsx
import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_LIST_QUERY, client, camelize } from '../utils';
import { IContract } from '../types';
import { User } from 'next-auth';

type useContractListProps = {
  token?: string;
  user?: Partial<User>;
};

const useContractList = ({ token, user }: useContractListProps) => {
  const contractListQueryResult = async () => {
    if (!token) return;

    const result = await client({
      token,
      userId: _.get(user, 'address'),
    }).request(CONTRACT_LIST_QUERY);

    return camelize(_.get(result, 'contracts'));
  };

  const { status, error, data, isLoading } = useQuery<
    Array<Partial<IContract>>,
    Error
  >({
    queryKey: ['contractList'],
    queryFn: contractListQueryResult,
    enabled: !!token,
  });

  return { status, error, data, isLoading };
};

export default useContractList;
```

The Contract Detail and Contract List hooks are very similar so I won't include the code here, but you can see the [`useContractDetail`](https://github.com/scottrepreneur/next-hasura-siwe/blob/main/apps/frontend/hooks/useContractDetail.ts) hook available also.

For the mutations we can add the `useContractCreate` hook.

`hooks/useContractCreate.ts`

```tsx
import _ from 'lodash';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { IContractCreate } from '../types';
import { client, CONTRACT_CREATE_MUTATION } from '../utils';
import { useRouter } from 'next/router';

type useContractCreateProps = {
  token?: string;
  user?: string;
};

const useContractCreate = ({ user, token }: useContractCreateProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  const { mutate, mutateAsync, status, error, isLoading } = useMutation(
    async ({ ...args }: IContractCreate) => {
      const result = await client({ token, userId: user }).request(
        CONTRACT_CREATE_MUTATION,
        {
          contract: {
            user_id: user,
            ...args,
          },
        }
      );

      return _.first(_.get(result, 'data.insert_contracts.returning'));
    },
    {
      onSuccess: (data) => {
        // handle effects of changes here
        // invalidate the query so that the UI updates
        queryClient.invalidateQueries(['contractList']);
        queryClient.setQueryData(
          ['contractDetail', _.get(data, 'address')],
          data
        );

        setTimeout(() => {
          router.push(`/contracts/${_.get(data, 'address')}`);

          // signal to the user that the change was successful
          toast({
            title: 'Contract created.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }, 200);
      },
      onError: () => {
        toast({
          title: 'Contract creation failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );

  return { mutate, mutateAsync, status, error, isLoading };
};

export default useContractCreate;
```

After we update the data in the hook we can invalidate the queries and update the cache with the data returned from the API. This will update the UI with the new data. Finally show a quick toast to the user so they know that the action was successful.

## Updating the UI

Now we can update the UI to use the new data. We'll start by adding a new form for creating new contracts.

### Create Contract Form

First start with the page that will contain the form.

`pages/contracts/new.tsx`

```tsx
import { Stack, Heading, Box, useMediaQuery } from '@chakra-ui/react';
import SiteLayout from '../../components/SiteLayout';
import ContractForm from '../../components/ContractForm';

const NewContract = () => {
  const [upTo780] = useMediaQuery('(max-width: 780px)');
  return (
    <SiteLayout>
      <Stack spacing={10} align='center'>
        {upTo780 ? (
          <Heading size='md'>Add a new contract</Heading>
        ) : (
          <Heading>Add a new contract</Heading>
        )}
        <Box minW={['80%', null, null, '40%']}>
          <ContractForm />
        </Box>
      </Stack>
    </SiteLayout>
  );
};

export default NewContract;
```

#### Contract Form

`components/ContractForm.tsx`

This one is a lot so we'll break it down a bit. First import a bunch of stuff. We'll come back to most of this here in a second. Mostly Chakra components, React Hook Form and Yup for validation, and the `useContractCreate` hook we just created.

```tsx
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaExclamation } from 'react-icons/fa';
import * as Yup from 'yup';
import useContractCreate from '../hooks/useContractCreate';
import { IContractCreate, IUser } from '../types';
import { isAddress } from 'ethers/lib/utils.js';
import { getErrorMessage } from '../utils';
```


Next we'll define the form inputs and validation schema. We'll use the `yupResolver` to validate the form inputs with Yup.

```tsx
const contractFormInputs = [
  {
    label: 'Contract Address',
    name: 'address',
    type: 'text',
  },
  {
    label: 'Name',
    name: 'name',
    type: 'text',
  },
  {
    label: 'Chain ID',
    name: 'chain_id',
    type: 'number',
    options: { valueAsNumber: true },
  },
];

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .required('Address is required')
    .test(
      'isAddress',
      'Address is not valid',
      (value) => value && isAddress(value)
    ),
  name: Yup.string().required('Name is required'),
  chain_id: Yup.number().required('Chain ID is required'),
});
```

Finally tie it together with the `useContractCreate` hook and the form.

```tsx
const ContractForm = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const user: Partial<IUser> = _.get(session, 'user');
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const { mutateAsync: createContract } = useContractCreate({
    token,
    user: _.get(user, 'address'),
  });

  const submitContract = async (data: IContractCreate) => {
    await createContract(data);
  };

  const errorKey = _.first(_.keys(errors));
  const errorMessage = errorKey && getErrorMessage(errorKey, errors);

  return (
    <Stack as='form' onSubmit={handleSubmit(submitContract)} spacing={6}>
      {_.map(contractFormInputs, ({ label, name, type, options }) => (
        <FormControl id={name} key={name}>
          <FormLabel>{label}</FormLabel>
          <Input
            {...register(name, options)}
            borderColor={
              _.includes(_.keys(errors), name) ? 'red.500' : undefined
            }
            type={type}
          />
        </FormControl>
      ))}

      <Flex justify='flex-end'>
        <HStack spacing={4}>
          {errorMessage && (
            <HStack>
              <Flex
                border='1px solid'
                borderColor='red.500'
                borderRadius='50%'
                w='20px'
                h='20px'
                justify='center'
                align='center'
              >
                <Icon as={FaExclamation} color='red.500' w='10px' h='10px' />
              </Flex>

              <Flex justify='center' color='red.500'>
                {errorMessage}
              </Flex>
            </HStack>
          )}
          <Button type='submit'>Submit</Button>
        </HStack>
      </Flex>
    </Stack>
  );
};

export default ContractForm;
```

Now that you have a contract form, you can add a contract to the database. Having a few demo contracts will help us when setting up the contract list and contract detail page.

### Contract List Page

Then we can provide a list of contracts to the user. This larger component contains a couple of smaller components that could eventually be broken out to their own component files.

`pages/contracts/index.tsx`

```tsx
import _ from 'lodash';
import {
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Button,
  GridItem,
  Flex,
  Link as ChakraLink,
  Icon,
  useMediaQuery,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import ContractCard from '../components/ContractCard';
import SiteLayout from '../components/SiteLayout';
import useContractList from '../hooks/useContractList';

const SubHeading = () => {
  const [upTo780] = useMediaQuery('(max-width: 780px)');

  return (
    <SimpleGrid gridTemplateColumns='1fr 70% 1fr' w='100%'>
      <GridItem>
        <Spacer />
      </GridItem>
      <GridItem as={Flex} justify='center' align='center'>
        {upTo780 ? (
          <Heading size='md'>My Contracts</Heading>
        ) : (
          <Heading>My Contracts</Heading>
        )}
      </GridItem>
      <GridItem as={Flex} justify='flex-end'>
        <Link href='/contracts/new' passHref>
          <ChakraLink color='white'>
            <Button variant='outline'>
              {upTo780 ? (
                <Icon as={FaPlus} h='15px' w='15px' />
              ) : (
                <Text>New</Text>
              )}
            </Button>
          </ChakraLink>
        </Link>
      </GridItem>
    </SimpleGrid>
  );
};

const EmptyContracts = () => (
  <Flex pt={20}>
    <Stack align='center' spacing={8} mx='auto'>
      <Heading size='md'>No contracts found</Heading>
      <Link href='/contracts/new' passHref>
        <ChakraLink>
          <Button variant='outline'>New Contract</Button>
        </ChakraLink>
      </Link>
    </Stack>
  </Flex>
);

const Index = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: contracts } = useContractList({
    token,
    user: _.get(session, 'user'),
  });

  return (
    <SiteLayout>
      <Stack spacing={10}>
        <SubHeading />

        {!_.isEmpty(contracts) ? (
          <Stack spacing={6} align='center'>
            {_.map(contracts, (contract) => (
              <ContractCard key={contract.address} contract={contract} />
            ))}
          </Stack>
        ) : (
          <EmptyContracts />
        )}
      </Stack>
    </SiteLayout>
  );
};

export default Index;
```

### Contract Detail Page

Finally we'll add a detail page for each contract.

`pages/contracts/[contract].tsx`

```tsx
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Heading, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import useContractDetail from '../../hooks/useContractDetail';
import SiteLayout from '../../components/SiteLayout';
import { formatAddress } from '../../utils';

const Contract = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const address = _.get(router, 'query.contract');
  const { data: contract } = useContractDetail({
    address,
    token: _.get(session, 'token'),
    user: _.get(session, 'user'),
  });

  const [upTo780] = useMediaQuery('(max-width: 780px)');

  if (!contract) return null;

  return (
    <SiteLayout>
      <Stack align='center' spacing={10}>
        {upTo780 ? (
          <Heading size='md'>Contract</Heading>
        ) : (
          <Heading>Contract</Heading>
        )}

        <Stack align='center' spacing={6}>
          <Heading size='sm'>Name: {_.get(contract, 'name')}</Heading>
          <Text>Address: {formatAddress(_.get(contract, 'address'))}</Text>
          <Text>Chain ID: {_.get(contract, 'chain_id')}</Text>
        </Stack>
      </Stack>
    </SiteLayout>
  );
};

export default Contract;
```

Now you have a solid foundation to get kicking on your business case for coordinating more efficiently. Do share if you have any cool implementations with the template. I would love to check them out.
