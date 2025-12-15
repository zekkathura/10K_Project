
-- ============================================================
-- GAME 10: Game 10
-- Players: Barrett, Brittany, Brandon, Paige
-- Rounds: 21
-- Winner: Paige (10700 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    'fda69eda-de09-44e1-ad57-767cabef3180',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'WMT3U0',
    'active',
    21,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'b19556c8-247c-4884-ab97-153684353d92', 'fda69eda-de09-44e1-ad57-767cabef3180', NULL, 'Barrett', true, true, 9700, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '60bb4931-16e0-4240-84ce-7050c397e5d1', 'fda69eda-de09-44e1-ad57-767cabef3180', NULL, 'Brittany', true, true, 8200, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'fc5d1221-415a-4548-9e81-8e9bd32f2522', 'fda69eda-de09-44e1-ad57-767cabef3180', NULL, 'Brandon', true, true, 8800, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 'fda69eda-de09-44e1-ad57-767cabef3180', NULL, 'Paige', true, true, 10700, 4, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '296651b8-9313-4a64-8fd5-35c52332049e', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 1, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a3a4f84f-a118-4fd1-bf74-ccffcfdd861f', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '17c758e3-ded1-4d98-93d3-55c93596b94b', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 3, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cb494345-9751-418f-b290-5b69d08ed624', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 4, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '33272ad7-c140-477e-a3ac-b6bd3886d1c7', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f85ae34e-3cc7-47c1-b201-cae69b8eff42', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 6, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a9bf5037-dcc6-4fe5-b03f-1fa53a88e366', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4c1d63fb-4ba2-4d3e-a9d8-2b18c3f05f57', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 8, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9cd1c941-b006-4c73-bf1f-a89f64b4c979', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 9, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'da5c2cc5-f324-4ffe-9d1a-0cf28c10bf5a', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9456bf06-da4f-4a1c-9fe5-0d815d5d31fc', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 11, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2f62403d-d7e5-4e49-ac71-434a479d77d1', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 12, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '87a31e17-d41b-4ab4-b8cb-a9cfcfc30475', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 13, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd04a5b58-2334-47dc-86eb-1f33a894fb3c', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 14, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4699e721-2293-44dd-af07-b7e713b833c8', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 15, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ac9ab3c1-cfff-4bff-9d97-1d1907424b6a', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4e5dcc91-edfc-4f5d-93de-276c13fc6baa', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 17, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '314c9a65-abf5-4c12-a544-806562082ff8', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '64e89b58-18f7-4ec8-ba8e-d784fc8d4c1e', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 19, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aaa00e61-0cd3-420d-b855-fa7e288ee635', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 20, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5a0a0d19-c865-479f-b4fa-df39a614ecd1', 'fda69eda-de09-44e1-ad57-767cabef3180', 'b19556c8-247c-4884-ab97-153684353d92', 21, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '66612ea7-fac4-4f9b-91b2-0b7e919bed0a', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd025a64e-7b86-4c17-a28a-75c8016cbd20', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e2fbd8d8-3dcb-43d9-b9c7-1b89536c2559', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '294400b7-1634-40f0-8c4f-0a3a6d5cabd0', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0b35e22d-8b7a-4b18-bda3-8638e9521c9a', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 5, 1400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5b389881-3520-4bd3-abc0-335f7b29e0bb', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 6, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '16f0e8a1-6c4e-4577-b4cc-f1a6c42014b1', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 7, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '05f1d546-5429-45e5-89a1-66feaa258fec', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 8, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '186d6335-71d0-43db-9496-2f7357fc69b5', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f9a1c401-1fe2-4118-b87a-6e280fc7fcf1', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '61523cdc-669b-4a61-9008-588d1d0baab7', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 11, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4ac857f9-a5ea-4dfe-ad21-c04b845142f9', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '11c894ac-2d3b-49d1-b7fa-663845c49d9f', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 13, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c76df360-6d80-49b3-875c-ccfa1a980114', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '78fa1dee-3955-4fb2-b90c-43f83b1b1874', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ffe3afc7-ec40-421f-91a4-7cbaf9a52184', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 16, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2c741805-2ff3-4428-94e6-f3dbf69022ec', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '20918260-5393-4b4f-be33-4d88950929b5', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 18, 3500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '58c32492-f33b-4dc3-91b0-9615c1426790', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 19, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3a593958-23e3-444f-a8bc-5df92442ce2d', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 20, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bddcc291-d562-4cf8-83a1-8bc28e2c7646', 'fda69eda-de09-44e1-ad57-767cabef3180', '60bb4931-16e0-4240-84ce-7050c397e5d1', 21, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bd1f3006-a4b7-4907-9b62-6806562d6aea', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 1, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f825e8c2-5cb7-4fe4-b159-c688624754cf', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 2, 1550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3c4017aa-5dfd-4a58-a484-451184419a54', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 3, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '39b3e63a-9a2a-489e-ae79-de5b79409b91', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '90c2bb6d-f936-49e2-b528-aaf3fbd841a6', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 5, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '81e66022-e056-41ec-8872-6885da86b073', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 6, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '483bfbd1-5a9b-4a65-a6ec-1615976e20a4', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 7, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '22407aa4-6be0-4458-84b8-660d1003e34b', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 8, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b305b03b-d05e-4991-93b6-0bc919e073d0', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 9, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '75a0874f-60de-44be-af4b-e83ed4a6e572', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '907c3a5b-6fc0-4f93-81c7-18327f2230b0', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ddab8718-4e50-4da6-9284-fd4c3f9b1f09', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5a10202b-d783-47b4-81c0-791981608dc9', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6730dabd-a97e-4df6-98f0-33c1c10fcb15', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '40b6d4e4-71bb-4530-8b2d-a312ba89c82a', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 15, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2c64b71d-86ee-4626-8f5c-6db82fb69b7a', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 16, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a71368b4-1605-492f-abd9-9a5f8b320b9c', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3ddbd4b9-bc4d-4468-8ae0-27dc230bf5da', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 18, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e76b7179-1d0f-41ea-9027-a78eda32b35b', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 19, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '34080fef-11e7-481a-8c83-01165ae4099e', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 20, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '79ee7fb8-a3c8-4b9b-841b-aabd25b1ac79', 'fda69eda-de09-44e1-ad57-767cabef3180', 'fc5d1221-415a-4548-9e81-8e9bd32f2522', 21, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '368ef648-f020-40ca-a5e7-6db5fdb68bee', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 1, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1740b2f1-3766-4888-8266-fa19ea7fc0ce', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 2, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8c443028-0778-4b05-82e1-f5b2b357cd60', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 3, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c0877149-1886-4cb3-92bd-cbe0955525a7', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 4, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f8f04fd6-a779-4363-b1ec-76f3a8be3f29', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 5, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ca28a7c0-bc78-432e-bbe3-4bbe5e58c667', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 6, 950, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6b0a26a4-b6e7-4082-9efb-f7c5a8e35dd2', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 7, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '952e1607-2899-49ec-a90f-7feab2c1fd62', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 8, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9308b8a0-3a49-4efe-8e33-2bd36d29a1cf', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 9, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3e147465-dc84-4a08-8953-e15abead46fa', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 10, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b55af168-449a-4ccc-a2ec-f9044e3b963d', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '579d4819-dcbd-4457-a2ac-6bedf5129f15', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 12, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '25649b55-71b1-4eaa-8159-68dfe58b9e5b', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 13, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8c28631b-ae12-4054-8bc1-177d7d244557', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 14, 2200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '87c5bd06-a61d-4c95-acb4-df1aefe04932', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 15, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '39e0adc0-364b-480b-9467-74990d53f23b', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '58c87894-4158-4f52-99ad-78db3afa2623', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 17, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2545515f-410d-48a9-9e8d-4f01aaaaa0ac', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 18, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1c6b67dd-9483-4788-b7aa-ce1ceb331a17', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 19, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '97995ea1-40d3-4a37-91c7-c5e1739bf7d6', 'fda69eda-de09-44e1-ad57-767cabef3180', '33ae2c7a-e1a9-4172-8bd0-903f706c90a4', 20, 700, false, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '33ae2c7a-e1a9-4172-8bd0-903f706c90a4',
    winning_score = 10700
WHERE id = 'fda69eda-de09-44e1-ad57-767cabef3180';

-- ============================================================
-- GAME 11: Game 11
-- Players: Jordan, Nick, Brandon, Kent, Mike, Paige, Ben, Mason
-- Rounds: 17
-- Winner: Paige (11350 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    'a96c2f4f-e650-4896-a20b-70dd2ba3430d',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'T6YR61',
    'active',
    17,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', NULL, 'Jordan', true, true, 5550, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', NULL, 'Nick', true, true, 8000, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'a1272a03-dd59-4808-b5ac-98b003972381', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', NULL, 'Brandon', true, true, 8000, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '024d6605-9992-4c09-9a0d-b2019e85898a', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', NULL, 'Kent', true, true, 7550, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', NULL, 'Mike', true, true, 7300, 5, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'f1fa0bc2-8905-4262-b858-52ec5b88184e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', NULL, 'Paige', true, true, 11350, 6, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', NULL, 'Ben', true, true, 3850, 7, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', NULL, 'Mason', true, true, 9050, 8, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ed6ee9c5-9c1b-4049-a9c6-4028594b1d07', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 1, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b86ab708-ec66-4bf7-b7ef-9f87727e2664', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 2, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a4d59502-53d4-4c2b-bd65-c1451c004268', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 3, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1b6abda6-cbdd-4719-bf68-91bef7980212', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9433ce2e-3f73-4447-b091-60051f67645f', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6de57090-face-43ae-bf6f-60cae7ffe332', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5ea588e1-7ddc-4482-ba2c-84b506e805a1', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 7, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'de6914aa-a77e-4a6d-b758-098ac42ef175', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 8, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f6583d05-58b2-4041-ba3d-e2727f96e9c4', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 9, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4825a1be-05b5-4676-b956-077a9c4d013e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '114eadcc-6579-4391-ab2e-4f34e21efe5f', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5db2ad3c-6479-4a10-9d9a-9e319042a8e9', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 12, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '26ba836b-346a-4c6b-93cf-ec3a7870d11f', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '46e59949-9f95-4961-a66e-570d3c47d600', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 14, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1bc572a6-cf43-4cd2-9e21-dd3d2553f799', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aeb551a2-7306-4144-aa1b-f268c4fb6a17', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6260d9ca-b297-46af-a9e6-143488d5a87e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'cf67998f-5ff5-4419-b56c-a52b8f3a4d0e', 17, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bee49177-a912-463d-aaea-87d1869ef894', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 1, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '812d9c5f-5833-41eb-be73-450c8cda1a5d', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '59879dc1-dabd-457e-94dd-a969a755da46', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 3, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a0b5e070-0601-4a75-aa6c-46c05889c880', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '86f3c179-6795-4201-962c-8639e20013c9', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 5, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aa89e8e6-bc43-4ee3-97a1-cccf7f1d272c', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eed72581-08b3-47e0-aa36-57f9c38d5dc1', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 7, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2deb8202-6a3a-4b09-945c-b3971d9adb39', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 8, 2200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '899dee66-082d-43d8-adcf-f3e2c53ce356', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 9, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd5905014-4e74-492e-a814-f5a5c02bc8b6', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e440f452-05d5-44b6-be29-24f44500ca1d', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6b0117eb-d4fd-42df-89eb-a8eff7ca3a9a', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 12, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6ae597f2-1960-4c1a-b197-aa0624d1f601', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 13, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '95366a4f-1313-42f3-a403-8c58c104d639', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 14, 1700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '359c041d-695f-480f-9f47-3316a948f677', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 15, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3daedc32-bc86-49ca-9be9-e84780365c45', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 16, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a5c7d83c-c335-4de4-b82b-1f19407adcdb', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a4479b58-7e45-4731-aaaa-fcdd83d1bcc9', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6b993c81-632d-4db2-8d70-1d740b48fc8f', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b3ddaf9f-cdeb-4940-8f40-8de2f21f8114', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 2, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '84c7fd0f-259e-4aa5-91c6-4e635f78f6f8', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 3, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c5a80cc8-2eaf-4d03-9f95-0f28f15adec6', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 4, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '62ec188b-cf03-450d-aa29-e09b078a30b9', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '03a7387a-48cf-4b25-a04f-86db6782d805', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 6, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eb187995-b805-4a06-921c-2db379aa954c', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 7, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '54dd7a7f-be65-4ef4-9b80-a04af424aac4', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 8, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8e389643-0433-434e-af24-c32f9d4166b7', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9d0620ae-610b-4824-a335-7d73984adbf6', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a223f2a6-d35a-44cc-b8fe-d6cb17388eaa', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 11, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e71d3b56-31cc-476c-b1c4-829e07f336e3', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6ef415a0-b413-4503-a439-bd9893a3b4d8', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 13, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '386a7b7c-e254-4db5-8e98-22e509b2ab8e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6679d396-c60c-4528-b36e-676dee96f71f', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5e0a5060-04bc-4cf2-be71-76780d9ba39c', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5ec766f5-89df-4f51-b9bc-f0b052a2eb4d', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'a1272a03-dd59-4808-b5ac-98b003972381', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a8ffc640-9d72-4f81-a59f-f229ad5877ae', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4fa4a22f-d6e6-4a54-a27e-ab8b61bf77e1', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7db9307f-8ca8-4ed8-a2b9-c9cb28972463', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bd84a894-d800-4fa0-bd29-ac3cd32eb849', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '58dcc955-f861-484e-90c6-ad89bf19a92c', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 5, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7cb806d9-511d-47f2-8803-32239184d363', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f362075d-dd91-4f2e-9763-50e2ceded322', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 7, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cf1d1958-c891-4596-9ee5-a916758c5436', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 8, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '22a79b95-7928-442b-b052-3ef7e48e4819', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 9, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0f43f625-1222-402d-b0b1-683b06d06deb', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c73511f8-aa3c-4289-a341-e970622421b2', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 11, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b9136ef2-222a-47b5-bab7-25afcb1fa521', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 12, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cdf0e231-a90e-429d-af21-b5161d7fbbdf', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 13, 1550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c6dc48b5-83d8-415e-9918-77ed984a920e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 14, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7ef24dc7-0960-4041-b402-3c4781233949', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 15, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '497adfdd-217a-41b8-8dbe-2811ffdc81e9', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6f8d76fa-aef3-475e-8768-b9aa279b58c4', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '024d6605-9992-4c09-9a0d-b2019e85898a', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f84756b6-b02e-4ef3-98f6-ec9c5df34536', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 1, 1850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b3166cdb-7665-4b3f-9e5b-dddfb164844e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 2, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '542454f7-ea27-489a-b60c-84053fa2e433', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c7aa06ba-3606-438d-937c-2c76fa0be407', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd783d499-c545-49a3-9f45-65d51bb5b861', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 5, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '65b4838d-bb4a-4395-922b-41adabcbf166', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '765f118d-4c20-4a14-8f6e-51f86b6515e1', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e97708ff-7be5-44d5-beab-db9c44b1d96b', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 8, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'daab1bab-e18e-4827-800c-e6cb5a270d01', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '54ea7e66-66fd-4327-ba40-6f2013591e20', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ce5e6a80-03d0-4c02-b9e7-c8ee2fcd4538', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 11, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5d89feda-1407-481c-a490-5a61cec09cfc', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 12, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ad6b52c9-2f8a-4a53-8855-38e7136c655f', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 13, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e9a11643-4265-414b-a25f-4974537ac591', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9614f1a4-248a-4344-a916-6ecfc0f2740e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bc9325bc-8322-452a-a9b0-5c0343a0fccf', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 16, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9ae6f4eb-3ddd-45e7-a117-cdf86e568133', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '164bc7b2-3085-49dd-ba55-f2dba9f7aeb7', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '05808d25-1c22-4dc8-a109-955c9d0d99bc', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '199fd42e-ff3a-4c3f-8fae-ecaca4b1efc5', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 2, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b0cf9483-53ce-40ce-9d3f-873373341b9f', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 3, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '01ba012d-89d0-48a4-9515-3f1a0132a9a7', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9eab3759-b302-4ebe-ab90-cff8030e1e08', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 5, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f3dba300-8972-4e28-8caa-3948ff2b2398', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 6, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0b850c90-204b-44db-a7ea-d0e39d4166c5', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 7, 1450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a80c8241-8652-4e43-8d10-1580e7a0ebf6', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 8, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '70677401-01ab-4869-9253-5d5649cb99ed', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 9, 1850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a801c335-f7f7-4fd2-8ce5-8acf9dacdef5', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 10, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ce8790c3-eb21-4d83-b976-d83f143a17dd', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3981d055-ba73-41a4-ac54-4277fec15a16', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 12, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '49943f75-e4a3-47ef-abe2-ba0d3327cf48', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 13, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '01073af3-75f3-4121-b524-b1ea5b013140', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 14, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c7a4a248-c97f-4737-a49d-133651576cbf', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 15, 2050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '723f5584-5a67-4c0a-b756-9d3dc23b3305', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f1fa0bc2-8905-4262-b858-52ec5b88184e', 16, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '43c905ae-6278-4866-96d9-1c5e9bd29e1b', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 1, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1e5949ba-00df-4094-98c0-41a098681cc2', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '74e07e1d-c97b-473e-8481-be74eacc5c02', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dd1c915c-638a-4367-bf9d-3553668711e0', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 4, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f7dcff3d-c4af-4d28-b057-6df2e8f2e80b', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fa7ca242-1d99-4598-974c-903ee3cd0846', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '54d1a12f-2613-4022-843f-60153c8bcfb0', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 7, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '20f47e5c-abc3-4c60-b124-2c3c80974873', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 8, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '30224b9e-f306-4c60-9887-b35e5771a972', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1fa1d79d-3720-4aae-a49d-d06b2f0a8823', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9880e2c0-9fa7-4142-b150-b51a6908111c', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c034a9e1-7214-4d97-9b6e-f809748ce84a', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4999caca-cb34-4a0b-9359-3552eb650721', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 13, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f8f33ed7-0ad4-400c-971f-155f950ec3f1', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '155bd903-59d2-4703-8e28-2447b79df8b8', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9a2d6aab-5916-4874-8355-a29ff07f7342', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', 'f7baefd7-dd88-4dd6-bf3b-b4a9391a72a3', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c7fbaa33-3cda-4a6f-9fce-c8b367d834d4', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 1, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3584d6f9-118c-40fb-9bf5-eecad3597f3e', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 2, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b8472f7f-0301-4857-bcaa-7b589218617c', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9fba158f-b7a6-4b9c-9b90-7c614b01644f', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd5bc011d-60b1-4316-8cb3-f152832bfd2b', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 5, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e1db6dea-9cef-471d-b76f-2ba29712bcea', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 6, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'efd2b1e5-5acc-496f-a10f-a6a430e5eb76', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 7, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bfe5457f-a8a3-4a50-aa40-884e5269fd68', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 8, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b625fd95-1c24-43fa-bcb6-556fdddc28c0', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 9, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1d23d36e-2ba0-48ae-aaa5-e343bd402c26', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 10, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6b4493bc-1a69-4d1f-8a8e-47ad61ef664c', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0f35e3a8-1bf8-437a-b850-e9dc0c411698', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 12, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e6490c87-cc75-474d-b5d9-4998647f1a67', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 13, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6b1d58c6-5423-4b3a-91c8-9c6de7949104', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 14, 1800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9a387911-748c-43aa-b054-470dd7082289', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 15, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd942ca47-0ce6-4c93-86bb-1e7342319a35', 'a96c2f4f-e650-4896-a20b-70dd2ba3430d', '5a7d23c2-5e5b-4f70-bc74-1917eb294ac9', 16, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = 'f1fa0bc2-8905-4262-b858-52ec5b88184e',
    winning_score = 11350
WHERE id = 'a96c2f4f-e650-4896-a20b-70dd2ba3430d';

-- ============================================================
-- GAME 12: Game 12
-- Players: Mason, Paige, Ben, Jordan, Brandon, Nick, Mike
-- Rounds: 16
-- Winner: Ben (11650 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'OBD7M8',
    'active',
    16,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', NULL, 'Mason', true, true, 7150, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', NULL, 'Paige', true, true, 6450, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '83b30b11-a81f-4d6e-bb41-869882e788f8', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', NULL, 'Ben', true, true, 11650, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', NULL, 'Jordan', true, true, 10900, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '20782f4a-77de-4910-87d9-2e33f1f29de7', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', NULL, 'Brandon', true, true, 10750, 5, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', NULL, 'Nick', true, true, 4550, 6, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'ccb18226-8bc7-4b2f-9941-d4c964216d01', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', NULL, 'Mike', true, true, 3100, 7, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ba84018b-ebf5-46ce-9dd0-ec19dfba5448', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 1, 1350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7a6564b4-1b96-4758-a668-3e90d941033c', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2a374e74-6cd9-403b-b61f-0b8dcb42adb3', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 3, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e0ecfc21-c57f-4d6e-87d8-14425e463515', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 4, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1a3d9223-ee75-414d-897a-a603e0c15b18', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 5, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e542501d-050a-47ed-b2a8-e9ca2c3873a0', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2212f823-70ae-402c-9d1c-fe6660bcfd9a', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '73c46dab-2359-44c5-b0d1-c7fe82ce7573', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a36031b9-6d18-49ca-badf-bf3724fe2e32', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 9, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '523910b7-7a19-4e6b-aa98-b6ee4e5caa5d', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 10, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '78952bab-9822-4b6a-b60c-33c26824e302', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '79d150cb-4f3c-45d3-a204-3081e44a639a', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 12, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ae3d3961-8d1c-4cc6-aa36-814b436bff36', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 13, 950, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9be7fe5a-1aa8-49ca-ae1c-8be2b192f3cb', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 14, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '13dfd050-c012-4193-9108-41482f7a70ce', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b97bbfb3-44db-4d40-9f0e-4b0b73c6beb1', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '9c63727c-35d2-45ca-aeef-afb7aae1aad2', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fffb5987-924e-4763-8c72-0c03926a36b0', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 1, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e3aba5de-043a-478b-b6b5-31d033681c62', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6893be58-1324-4225-9af7-12a6088a6f87', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 3, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4429d6d0-8106-44eb-869e-aaa6106a5aa4', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 4, 1500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c3951e4e-7e28-4994-bddf-75c8df5f8e67', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 5, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4855be0e-7875-4a73-95e1-3335736d8fef', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 6, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6dd85867-675f-497a-938e-4f8af4b78a58', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 7, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8a935a89-f085-463e-83d0-24daf82125be', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '02608660-cc0e-4331-a5e9-ce8757fa683c', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 9, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9e7bf5e1-7b1f-4127-bb85-822e2bb99c2d', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 10, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a5d92f13-3900-497e-8465-452d5b21e11d', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'f4234b5c-41ae-4224-ade9-cd5ddbac5563', 11, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5c922f2f-066b-401d-a9db-18c8e7386e4c', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 1, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8630b88f-860c-4e0e-9aad-3bc463ca4c4c', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 2, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9fb2df97-c625-491c-aac7-1aa50eab87a0', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 3, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f57a6ae0-b426-448a-a836-194f93e8a200', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 4, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '63e6b143-f63a-4afa-a258-327003dcfdf6', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 5, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ca1acd6a-af46-4f08-86f4-095e928e80ee', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b36719cc-eb1a-4a2e-8bb9-9545c2ff5a9a', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aef16bb4-0725-40c9-8486-7dc21afb705f', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 8, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '04e9589b-93c7-4945-9510-11e3dd3b43ab', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1d72f9c0-9cb4-4f30-b1bf-fc434a2ec470', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 10, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ff9d7007-e780-4ff3-926b-f0c113d8d85f', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 11, 2150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '34a4104c-9516-4054-bbe7-1b7256772d50', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 12, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '373ddf30-c1d0-4ac3-9a97-811d1edc8e63', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 13, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e9f48979-9ca8-4e2c-bd3c-6d7c5e9262ce', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '57ece105-5877-4038-a3f5-74e6bce48182', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 15, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e9c4fe4d-0ef5-4e4e-9194-71bdf031d820', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '83b30b11-a81f-4d6e-bb41-869882e788f8', 16, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7759a756-6e58-485b-8844-7cf477c42194', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 1, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0f5d2f48-3ae9-46ac-9454-b732a3286f1d', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 2, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '57f9061d-07bd-4ecf-911b-acf63380c765', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 3, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3a15f004-99ce-4969-98dc-5007f54ded83', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 4, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e5b761e0-f2b7-4378-ad12-5b21e7d84682', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dcbb3c6d-d5dd-4b27-a74f-b885f58eba57', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bc7a9cf3-9305-48ee-a9c0-8d4e8e15b97b', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 7, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ec212358-0a59-434e-a0f7-86df6afa8da1', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '146367ce-6968-41be-8264-528a9ead4d31', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 9, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a381ce60-8061-4398-9e9e-aa608d4f163a', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 10, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '82f67d0d-e68c-4afa-9e15-eac3e785b34f', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 11, 2500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '52d76e40-06c9-4dbc-ac05-4809ca485468', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bae21cec-2ac3-4408-9d18-dab9079d7f6a', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4f5c1978-49fa-492c-b02b-ec29b5482cfc', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 14, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cd2b0bbb-08b4-4151-a917-47aba6b1b122', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 15, 4000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2445cc55-ef07-40ff-94b5-afc2e36b8f0e', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '8b9e8bfe-6f4c-4f6d-b1ce-0ca967aca700', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '45a73774-cec5-4337-8178-a34d460244a5', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 1, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3afd75ed-0b0e-443c-b1d7-cb50d65ca477', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 2, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dc7b4f64-a640-4dcc-b17b-745268b53e88', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd62776e7-bd06-464b-acc3-ab77b86c5bc8', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '50e70dcc-8e77-4e52-8c42-4a4c0b6e7907', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 5, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c54638f0-d138-4599-be4c-c74582f7d51a', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '48cdd864-1429-4f22-8634-23697e2d9105', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 7, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cb40835a-f2b5-4a4a-b02c-f36a34b8b16a', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4d3cf6c9-442a-4b63-ae32-b41cf8e9ece6', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 9, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '684a1fa8-ac61-4deb-8c50-f5aa919a198e', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 10, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e0cfcefe-c539-481f-822c-33158d1abb00', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0843c56a-cb53-42fc-9701-776853b04a6e', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 12, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'de15caeb-f25e-4250-9ad9-e1438e80124b', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 13, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c55095ba-0579-4473-b842-e78fe8faab68', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 14, 2150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9d6f4eec-edc7-43cb-83ef-3b8e27ea63c2', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', '20782f4a-77de-4910-87d9-2e33f1f29de7', 15, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '09ab0b3f-7b98-4b55-8862-468a895c1c89', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 1, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7386a683-0844-4b4e-a6b9-c008fbebf32f', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8ab86c48-e906-43ed-9300-407ec266fc48', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3c8452fc-4355-4610-8c1c-98eb448081f0', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '50ea82de-8bb4-43c2-adf5-638a60a62604', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eb17339f-9c90-44da-be2d-d6cf1286c220', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 6, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4c42a8c8-e982-4fcd-9756-9f691f9a68e7', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 7, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '051b247c-8435-4b48-bdeb-f12ef96fcaf2', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 8, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a9ae1c2f-f2c9-4d75-8add-fbc5de8dc93e', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 9, 1450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '82ae8093-c1cb-4fc1-bf01-024aa890295f', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5e8f2abd-4c1d-4ee4-923a-5e9432da68c2', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '91828f49-cc3a-42ab-b8c1-c86269daa737', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0a9fd44d-68c5-4855-aef3-9e6e2f7c0f20', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a3c222a1-d700-4b64-ae95-236acdbcf268', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c64bdb39-825b-4f7a-aa6a-257e9a170924', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'e2d935bb-2310-4f55-a974-4b03b4b4a09d', 15, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b3e04380-e567-42c2-affd-eb0680498ac7', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '836ae6c1-f0ac-4775-b031-0f999cbaf135', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b26e4207-c65f-4029-80dd-6c940e4d6ef5', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bc0d7f26-665e-47ea-9a3f-5890c7437ecb', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 4, 1350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cd85c082-1952-4eb0-8a00-03d9495357f2', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f0a0d8af-2efc-4fc8-8aa5-f6cd402b0a60', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '940e9e7b-5175-4268-8320-db40882a9a3e', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 7, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '70a634df-d2eb-4d28-abb2-02b769e5e968', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e7b5184f-c529-464a-ab9c-292b82641891', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ebc913b5-a861-403d-8f37-5c04419660c1', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'daa76f0d-741e-4d64-8ecd-c569529aff9a', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '94eea083-cdf7-4014-ac36-b9c6e28b1b2e', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f030d832-c447-4100-9eea-8630faf15bee', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 13, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e34663ef-8d2c-4c79-9a7c-171ee9309cb4', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'af6943b0-937c-4036-bfc4-076ef2e2b900', 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5', 'ccb18226-8bc7-4b2f-9941-d4c964216d01', 15, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '83b30b11-a81f-4d6e-bb41-869882e788f8',
    winning_score = 11650
WHERE id = 'f6fdc57f-faf9-48ea-a1b3-ef30902dd6d5';

-- ============================================================
-- GAME 13: Game 13
-- Players: Mason, Paige, Emily, Alex, Vance, John, Tammy, Brittany, Barrett, Brandon
-- Rounds: 10
-- Winner: Paige (10900 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    'af55c154-156f-48e8-89e8-6232b9834542',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'TIM751',
    'active',
    10,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Mason', true, true, 6650, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Paige', true, true, 10900, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Emily', true, true, 3250, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Alex', true, true, 4700, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Vance', true, true, 5350, 5, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'John', true, true, 4800, 6, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '533b93da-5f7c-40ce-96c0-160b3c188a8a', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Tammy', true, true, 4800, 7, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Brittany', true, true, 4800, 8, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '01e8837a-1f0f-4759-bb08-92927503eff8', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Barrett', true, true, 5800, 9, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'c10ba5ed-abca-41a8-a847-06606585a586', 'af55c154-156f-48e8-89e8-6232b9834542', NULL, 'Brandon', true, true, 2400, 10, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '694e9812-d752-4da3-a092-79ec435e20db', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dcbfb3e4-db30-4dee-8e00-bc8ef4a884f1', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 2, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3830160c-af12-4442-ba01-93dead3e599b', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 3, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '785fa1fd-d691-4334-bc55-eddf990c4fe1', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 4, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '39243e05-0a23-49b5-9a4e-ed0698d36327', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 5, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f7b86ed9-cce4-4543-b6e7-6340b7b92bbd', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 6, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '33479efc-f71f-45ef-9498-a0560adc38b5', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3a9efee2-dab8-439d-b054-be1f1c901b5e', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 8, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fa049527-15ae-46fd-9688-0fb9d635a375', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 9, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5bc02379-a027-472c-882d-7765213f4f10', 'af55c154-156f-48e8-89e8-6232b9834542', '8bfe0223-0ceb-4f45-90a8-ca83e41901bf', 10, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '294727c0-a035-4820-9d5b-d01d2dce0f50', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 1, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8d10baa8-16be-4acd-9fcc-583a44afef11', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 2, 1500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4b20e00b-6ab3-4424-96f8-a58738f07282', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '692b3238-b039-469f-bd0f-7f3d077929f0', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 4, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e836b790-8461-4d71-b5fc-59acb7368464', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 5, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1e828f62-b4b1-464f-9f8c-6e7865b454df', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 6, 2200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c570b890-efd9-4ccd-b9c1-cc575896f2fe', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 7, 2050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '92ea3e14-2eac-44ad-bda9-0b31d2f8116d', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 8, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'af1e67e4-1dc3-4f2a-825d-63b8006d7b9c', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '75336ca3-2d32-40cb-998f-d692aec9b5f3', 'af55c154-156f-48e8-89e8-6232b9834542', 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee', 10, 1500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e8449cda-db7c-499d-b64f-890dc45557b0', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '25911878-c95e-49d1-a8ac-f28eeb1e0be7', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 2, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '07623bfe-767f-41c0-96ff-64fd41a604e9', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 3, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3a96f8a4-a6e4-4186-a579-99cedf1e807a', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c4dd4c74-ee4b-4bdf-9424-ba61187d2c02', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 5, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '349055ed-d0aa-4745-bc1a-29b0dbd94bc0', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1e2b45f9-1431-4f2c-91a4-1b675002b92b', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2e387be6-fca7-4bd5-bb74-96d72f6c581f', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd0278489-3101-43ab-a50e-73c44d5e2ee1', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 9, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '72ebdfaf-f5a6-491f-8a44-d65acc7f840f', 'af55c154-156f-48e8-89e8-6232b9834542', '7d1ab4ac-8b55-4b90-ab33-ead919e6e277', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e3a7b067-d0f7-4be7-97e1-723c4dd792f9', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 1, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4cebef24-8ebe-4f6b-8ca3-20edf948ef3c', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f989902c-018d-45f2-af49-ce28195e4684', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 3, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'df0132a9-e470-4362-bdc3-5e9fde4e863e', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '568381ec-6f1f-4d42-be36-e5e85b4ebfe4', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '39ffaf11-cfe3-4412-9509-b3b74c07e836', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 6, 1600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '23e2badc-c35a-45a9-81dc-e7fa9513192d', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aaa25352-8fe4-49b8-a7e4-a344a4dda165', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 8, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '39c1ede6-4829-4d21-9b75-9cdcfd32c964', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 9, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f338c5dc-0d7f-49cb-90be-b96678150756', 'af55c154-156f-48e8-89e8-6232b9834542', '9dfd5ade-6854-4206-8886-e1db3ea4ce67', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '26b85780-c7c0-4eba-922c-330607c17995', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 1, 2050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4dd61177-5bab-4d85-9bb8-7023bb628df0', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '028d74db-d43a-4b7f-80a7-f2397014fce6', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 3, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2bd3cb05-bfd0-4392-8afb-3dda185e8126', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 4, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '946c6b3e-8eb0-47c9-8de0-a94fece3b292', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 5, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5643ef32-caff-4dd7-9589-87c28ac4fe40', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 6, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f448f9d5-4ace-442d-b3c8-7f80732ad4f4', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9f1fd8a9-be9d-43ba-8465-b174ecd3106c', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 8, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ec683c59-feca-4f39-b5af-80048578fb1b', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '959f3831-0da6-4511-80a6-1fcb8f95ac7c', 'af55c154-156f-48e8-89e8-6232b9834542', 'dc91c00d-7227-425b-bfe3-631aa3b3a27c', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9008afa5-1dab-4613-8924-70f8cda894d8', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 1, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f26ce65e-82ff-4024-b560-52c18d4c953c', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 2, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '20e70273-f58b-4a78-916c-f9dd73b7bd70', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 3, 950, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6ebae60f-f905-438a-8e6f-8092f4444c9a', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '42d261d7-a1bf-4fba-b5fe-0a7df785fb4c', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cd2a22b3-28ea-4f8d-8944-f3006f21c8bb', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 6, 2050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd01eaebc-e7d9-447e-9fe0-5dae1a982bb4', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c5a7175d-2929-45bf-8fd7-c5f0faa2b6ff', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '70701d37-a060-4bb6-a2ca-180030fe1a0c', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6a5dd41f-a5f2-429e-9d78-a6f89259d243', 'af55c154-156f-48e8-89e8-6232b9834542', '740b0667-0bf0-4d6c-9aa9-33db408c8d67', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c51247fe-c91a-44ec-9938-c23f5484ef45', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2fa2c4d3-2305-4e41-a038-b35cb8a5ab28', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 2, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6dbe5bda-6268-4199-9895-88bd896a7104', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 3, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '69785d29-2f83-4ff3-83f1-c84e97ca2854', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 4, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b105d386-278a-4558-9fd7-644610124a06', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '90382c94-6f7e-4c15-8387-92ffb591c36e', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '43db85bc-b822-4c2d-879e-30b00c91bbba', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 7, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3457ee91-f452-46a6-902d-c83032531d58', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 8, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '87374beb-8602-4dbd-975f-efb3adfe78c6', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a0ed82c8-ad80-495b-918a-652cf54d08d9', 'af55c154-156f-48e8-89e8-6232b9834542', '533b93da-5f7c-40ce-96c0-160b3c188a8a', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b4dac45d-23b3-46af-8a7c-9b4550179c6a', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 1, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ffc6a925-f2af-4836-9d56-ba074f010aaa', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '704a606e-e760-45ae-854d-340a080b33da', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 3, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ab378641-02b9-4aa1-a517-75fbdcd319f4', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 4, 950, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '25197b80-1047-45fe-bde9-f1d6876368ef', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 5, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7000301b-991a-46b3-9be0-27b013b200d2', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '070631f1-b391-4f7c-8dc3-68442ae12bad', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '75947510-c18b-48dd-9073-302bf2f11689', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 8, 1700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '16845fb3-3c33-4477-9421-465fe0025a35', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b44884e5-c714-4773-b6f3-7ba0a8457d75', 'af55c154-156f-48e8-89e8-6232b9834542', '4e7f8b62-f3a4-4863-b149-68bd69b9897a', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ee7e0e96-cd2b-4f97-ae17-5c11b2ba15dc', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 1, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e6aaab1d-0c4f-4679-a31f-fbd4045c4cc6', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 2, 3000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '17f0e914-51a9-4aca-a07e-0fc797e72f09', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '707eaffd-1d5f-42b4-ae68-301d643917e9', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 4, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '787e0f72-f39a-4368-92c5-a435aebb69dc', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '057d7f74-07b5-42ec-af98-933f4868ac9b', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '47e415f8-ce73-4d7d-9056-e602c20ec254', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 7, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e3139249-d450-412a-8e9e-dc92e5001da8', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c63c1fe9-c082-4890-8bb8-c9259b37387a', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 9, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f6e80fdc-736f-48e6-9d9f-aca6bfd8c9ac', 'af55c154-156f-48e8-89e8-6232b9834542', '01e8837a-1f0f-4759-bb08-92927503eff8', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6ae29e7d-15eb-467a-ba4c-b3699417e95c', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 1, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '47f3f65f-2ae5-4f2c-ab59-9cbf52467b7d', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 2, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '76581c7f-f284-4eab-8076-d1dc8c08fcf1', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '97c01ce4-0297-44c5-8f26-7ad0d9401000', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 4, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f9da0f51-83fc-4442-92c6-1357cb39f450', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '176408b6-12b3-4bd4-82be-ded5444306e3', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cf16d186-3bb8-4c89-b4aa-a3635e190629', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3561a3eb-f6db-46b2-9d4f-ea0f8733753b', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b5004f5e-baa5-43a3-904e-a17281f8b2dd', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aad0a898-9662-42aa-94f3-02ca3d7b4caf', 'af55c154-156f-48e8-89e8-6232b9834542', 'c10ba5ed-abca-41a8-a847-06606585a586', 10, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = 'bf6a74e6-598e-4a3b-b47e-e1f336a332ee',
    winning_score = 10900
WHERE id = 'af55c154-156f-48e8-89e8-6232b9834542';

-- ============================================================
-- GAME 14: Game 14
-- Players: Brandon, Mason, Ben, Paige, Jordan
-- Rounds: 16
-- Winner: Jordan (10450 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    '8J3SEA',
    'active',
    16,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'e68cc354-7b5a-44fe-8473-a2f339edf687', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', NULL, 'Brandon', true, true, 8600, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', NULL, 'Mason', true, true, 7450, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '261ac0e6-c4c3-46c9-92ff-8551ab213b29', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', NULL, 'Ben', true, true, 3400, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'edcda4a9-213c-4e2b-9217-38a1666de1cc', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', NULL, 'Paige', true, true, 4650, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '99c21706-ed40-444c-9fb7-d571d57c4049', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', NULL, 'Jordan', true, true, 10450, 5, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '38c8eebb-0689-46bd-a9ab-ba1b77ce5656', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7e3fab7f-72b2-4c9d-91a0-42903f9f3db4', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 2, 1600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '00eab31a-0894-44a7-901f-6a1aabffc4af', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 3, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '84d5908f-b5a9-423e-8620-217907b17d12', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dec5e000-476d-4318-9d10-7c04bce61d4a', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '19d2f4e0-da00-4cfd-8454-a646bd7d2ada', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 6, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1f570e5c-8513-4379-8d22-420b0a41775e', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 7, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '12d07b02-18d2-495e-9bde-e8d7cc010a2c', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 8, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '805581c1-fcdf-4d15-b004-7a05ecd6621f', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f5d60e48-ea46-4e26-a6a5-85b355f49cf2', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f7168aa1-8b23-41dd-9d98-975ca3373332', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 11, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f74c75fb-db41-4cbc-8cd1-881e2d5f0f74', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 12, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6434e93e-d0f4-49f0-a8ac-1af53e71cfce', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 13, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f204d1eb-8fda-40ce-9d41-40105a11f23b', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 14, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4146bc91-1b81-4da9-8b32-4fffc92eae44', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1b2a3461-ee42-48c8-898a-d93bbf00e1e7', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'e68cc354-7b5a-44fe-8473-a2f339edf687', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cf3bd1a2-b965-4a15-a889-a86a1cef6ffd', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 1, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '519d5d4c-e41d-4067-83fd-923177f8f2e3', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '753c70b6-4511-4804-8fb6-e8b6be83a8ed', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '95b1d410-f128-4eea-a985-31852a6c8728', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 4, 200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5b88b606-6b24-4555-aff3-cf89ebaaff79', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 5, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f887986d-f427-4adf-9774-d4df8e935c14', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 6, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '59f650d5-2f0f-498d-920c-54d5342943a8', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1faa9dbc-06f6-49c7-8597-185e598df0a9', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 8, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd9d46f1e-6397-4811-aa98-d37029b0d8a1', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fafadbd5-f32e-4308-acfb-1dc297962c7d', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 10, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '997bc722-4d31-40f5-900b-80ef8b838a99', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f2bf98a2-5fcb-4a4a-a1ed-2ae4d575ca75', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 12, 1700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b216e431-7fcd-4b6a-a697-c3a68f56f803', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 13, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5d382bd5-c232-43a0-8262-551ded16ba9c', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 14, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '362e2528-fac9-48be-b0f2-731f251dd4b7', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 15, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '759964f0-fc23-43e5-8b6c-144c0d66d55a', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'bd89bc44-3a12-4439-879a-3e8be1c2bc7b', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cceaf9c6-f5e8-484a-8552-07a28a397e46', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 1, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e4f9182a-644d-4ef6-b027-b7517e15c111', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '87696b5f-2e69-4775-a9c4-89e8bf83f46f', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '620d1b37-48ad-4152-9dac-e4ba7d31451b', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0377d587-f948-41ff-a7b1-e8edb48c7d33', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '24c6e065-3b73-4670-91aa-7af2d821da60', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0bd4cb6e-0d26-48a4-b58e-08557994d9a2', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '783db70e-9d26-455d-9703-f5d07e1c6a11', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bab4b1cd-a6e0-47c3-9330-67ea8c33b9e2', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 9, 1850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7c9eb814-65d9-4023-bc56-d700bb15671c', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a3ac2fa4-8c64-40eb-8644-19bd349d6d14', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'feb7387c-8cd8-409b-ba54-61d5903ec6e4', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f07dbed4-ab86-49b9-95c2-f8418e85d7c5', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2d145f3e-dc9f-4a79-834d-5af4ced3b809', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 14, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '22b1cf22-2743-4aba-a152-38f2676cf09d', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '88ae6980-8f6a-4cd9-a19b-2e4abc22b841', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '261ac0e6-c4c3-46c9-92ff-8551ab213b29', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9f6e720d-d74b-42e8-b3d0-40131880463d', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 1, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b9a2361e-fcbd-4c7e-85ff-0b7a90bdec59', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 2, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '831b4762-449f-4f1f-954a-7fbd62567f0e', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4f788c3d-27f5-4b6c-876e-01a86ddd6554', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7f54c7a4-6c50-44bf-a197-bbd16dfdf003', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 5, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'afc42f04-5f53-474a-b3e3-a0847fe0027c', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '27d327bb-728f-4df8-8002-0aca5287fed9', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8903272d-45c9-48ea-af3d-f781e2acae09', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 8, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c503b26e-a36b-4bd2-93b1-492262e20246', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 9, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1aad2f28-1956-482d-989c-8f5ec07a47cc', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0b5f95b6-348e-48cc-a75c-329cd0cfc3e6', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9649461b-29b5-492b-9d5b-bcb7a30bc8b1', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'af6f2dc7-cce6-484b-a1ad-73344512ebdc', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 13, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8eadeb66-4d00-4951-a259-040cd7c891fc', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 14, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8c1cd5f5-3f4a-43b4-aacc-f2dd838b0d17', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7ac6f78c-a7d6-4420-aa34-737a9d52a059', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', 'edcda4a9-213c-4e2b-9217-38a1666de1cc', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c69ebe72-8735-4e2b-b702-c70237e5364c', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 1, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3b844fa2-9259-4b6a-8043-c0d925f247a0', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 2, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '544fc871-a6ad-4817-97e5-09645ad81484', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 3, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8fd5cd9b-1b9f-4a3d-93ef-679212915665', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 4, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cc34e48e-985b-443a-a7f8-59ac59a9e37d', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 5, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '32c22a40-8e96-4ccf-a1db-9d66165335e4', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 6, 1400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '872799b7-b672-4b59-bf2c-16cf68248fe4', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 7, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5a1ab9e2-08cd-4591-b823-95d4701ebd08', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 8, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '50e054de-7bac-4d22-acb4-f1a1615ab581', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 9, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c049351a-2ec6-4c28-9d15-d63fda05ce4c', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 10, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bf7d3bcc-1767-4109-8043-d9270c83804a', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0e5a791f-b8f8-454c-9a19-1b42def0a613', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 12, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '356290b8-7460-47ca-9b49-28ee4e4ad5ab', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 13, 1450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '606c99fb-a895-4b8b-9d4e-bb0e66650088', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7bc2adde-29e1-4daf-8b43-a0900a205b76', '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0', '99c21706-ed40-444c-9fb7-d571d57c4049', 15, 750, false, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '99c21706-ed40-444c-9fb7-d571d57c4049',
    winning_score = 10450
WHERE id = '95c6d380-4c6a-4a3d-8339-d89bbf8ac1b0';

-- ============================================================
-- GAME 15: Game 15
-- Players: Brandon, Paige, Paul, Payton, Casey
-- Rounds: 15
-- Winner: Payton (10250 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '839d2c44-3e01-4baa-a0e1-a4176f0baba6',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    '14Y7BL',
    'active',
    15,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'd18a09ea-503d-4b0c-8189-456324247fba', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', NULL, 'Brandon', true, true, 9450, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', NULL, 'Paige', true, true, 6350, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', NULL, 'Paul', true, true, 10200, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '7671dcf3-6174-4c7b-857f-7b6f62b3024d', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', NULL, 'Payton', true, true, 10250, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '860ec319-1438-46f3-a780-8421c198efed', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', NULL, 'Casey', true, true, 8300, 5, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b3ba2d7b-0767-471a-99b4-a7f19079083d', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 1, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fd156740-5611-4111-a8d2-72aecc6110dd', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 2, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '260b7a1a-d725-455a-be39-b5cfa229110c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 3, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0dc29dc7-c14e-4bba-a75e-c566f6402918', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 4, 1600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9989861e-c703-4ee9-a6bb-fb7c51882669', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '830c43b2-f411-4e75-95aa-e48a70aae584', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 6, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '11ac4932-a4a2-4613-aa17-27976e14792e', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 7, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '27b18741-e61f-42b8-858f-3fa92480b5e2', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7e283f3d-a69f-4eba-9853-412d5591094c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '612afdb7-24c7-4660-8574-ad3a46a6a18c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ee8aa686-9815-4d76-934b-a95b41ede155', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 11, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3b004989-d736-4237-8e2d-201cdc3dba76', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 12, 1450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '268363c2-b4c5-47f6-8e89-6e56cb782d8c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 13, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b5485d73-194b-4630-b385-a8cd2bc015aa', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 14, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fe58b208-7119-4341-823f-45ae8d1fd306', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'd18a09ea-503d-4b0c-8189-456324247fba', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7b9fae56-8bfc-4402-a406-3b1b7285f73d', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f83a8d82-e82b-4743-b27e-5751200c8f0b', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b53a1882-3460-4519-a6bd-669fba270468', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '725f5af3-231a-4911-be71-e2c34e7c5950', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 4, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9698d03f-4802-405f-9ea7-7450f28774df', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 5, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e7d4d95f-3d16-4788-87f0-99476b9b1d44', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 6, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '82908e9b-faa6-45b9-960d-efa354fd07dc', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 7, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eb779265-143b-4975-ab94-d92ef993b0fb', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 8, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5996ac5b-4a89-4e62-afcf-d554139a353c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 9, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '09d9a2be-b11c-4df3-833d-77a19111899a', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2898975f-ec32-415a-b7f2-010635ea7644', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1a55c8c2-06a1-4b89-9b72-968f9e3e8e8c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 12, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '43bc7ebd-f336-49d2-ad58-63ed95fadab9', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 13, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f6cf568c-cf58-48f6-8de8-38a45c52aaaf', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'be570807-5431-459c-a3c9-2b770e8797de', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'cb88f2c9-dfcb-45d1-902e-f7d1172c8031', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'db9cb3e6-c74e-4c98-bf40-f423d9bf7219', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 1, 1350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '90f883d5-3da2-401d-8e7f-da1cc6403e25', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 2, 1600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eff3046c-85c9-44bc-b8eb-6aa9cb0df17c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 3, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7200bb69-2121-447d-8116-230c7c2ac024', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 4, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '85aac456-e12e-42f2-9146-aeb65f44b6b9', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 5, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '020b8c19-fe08-4b77-947d-088376e1c1d8', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4c07e596-d2b4-4b17-b1fb-84dd30f2cd5b', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 7, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c4827af4-5ee2-4b84-b26a-d355a403950d', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7b8a3a47-798e-412d-bbca-789130fb8f59', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a25a203d-e13d-4589-9429-04b2811f0bef', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 10, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cd617b4b-245f-4657-bcc2-ac31be920506', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '47c0fb4c-8406-41c4-a8ea-5df136f40811', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 12, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '95a49697-79ae-4a83-87be-dc8c8e7ee71d', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 13, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b2626801-424c-4b1b-8cd2-ee2f5121c319', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 14, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd5d5decc-280d-4945-ac9e-78db48f9c67b', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', 'e2e5b235-a3e1-40fd-802d-cb50339b6b2b', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '35815676-a260-4e49-9ab3-05a6acafcdd7', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 1, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9f069b82-04d8-477a-af5d-3cc27143e778', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 2, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '51504c60-d2e4-4374-a363-9bbd1f9714e8', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 3, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '579dc354-b7fd-4768-a4e2-2305e611dd35', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 4, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b770f033-0fed-4b0d-87fc-6bbed7ddec71', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 5, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a5431aad-9b44-479d-a68e-c3668a3d02f7', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 6, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a5c2b5b0-d5e5-4057-a73b-37818f25c31f', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2fd944a4-2eba-45db-bfd8-ec83f09b6866', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 8, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8443bc71-1e20-4e5a-b136-81b9805131f6', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 9, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cc9442c9-2bb2-4499-92e9-901935468fd6', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e9319c0b-4935-429a-af36-77504d19c264', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 11, 1600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '51524029-3576-455e-94de-6423c9205443', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '051b4f62-8668-4777-8435-475006eb2551', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 13, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '67c16fe9-d495-44e3-a582-041730dd576f', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '7671dcf3-6174-4c7b-857f-7b6f62b3024d', 14, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0210ca28-fac8-4235-bbff-97a5fed06b12', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '70a43fbc-3f48-40ed-8204-17a45376efb8', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 2, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0735651d-b3e0-404e-bd82-f008c87d2810', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 3, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a255b838-dfea-4f78-9b5a-491e33aab95f', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a46cb5fd-72d7-455b-b671-1596922dd8dd', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 5, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ad8a3857-c2b3-4220-8f0f-12aaa7054d35', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 6, 2400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6fca340e-ce90-450a-bd76-266cf9f7214c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4840971f-06b2-4c4e-87b6-15f811984461', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 8, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '86090688-0636-492a-871d-51715899cf2c', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 9, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '46107e07-474b-4115-91a8-723f5402ff5a', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 10, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e8d3d248-45bd-45a0-9738-53a1595e06d4', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 11, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e2ab7b76-ffec-445e-8222-86a29d93a6d3', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 12, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '086a01a9-3bbf-4d84-993e-c824e1f36bf2', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a0cd10f9-5de8-4e74-93b7-5f71b25345ca', '839d2c44-3e01-4baa-a0e1-a4176f0baba6', '860ec319-1438-46f3-a780-8421c198efed', 14, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '7671dcf3-6174-4c7b-857f-7b6f62b3024d',
    winning_score = 10250
WHERE id = '839d2c44-3e01-4baa-a0e1-a4176f0baba6';

-- ============================================================
-- GAME 16: Game 16
-- Players: Casey, Mason, Paige, Payton
-- Rounds: 16
-- Winner: Payton (10400 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '894d5e01-89c0-4fae-81ac-bbdd97dabc1e',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'AO4NWU',
    'active',
    16,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', NULL, 'Casey', true, true, 3555, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '55675895-dd87-4300-8ce8-2bc9bbbe9d43', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', NULL, 'Mason', true, true, 8600, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'ed660a10-f57a-41a7-ae89-05e9b4b69a29', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', NULL, 'Paige', true, true, 8700, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'ecb67ddb-c84d-458a-a850-2814e3d9438f', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', NULL, 'Payton', true, true, 10400, 4, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '98326642-efd3-40de-bf51-6b74b8a38edb', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2bc0317e-0fee-4d85-9278-b08efae58497', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e5531b62-d1aa-4db1-afa7-f076ccf7b9ea', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '39e4c08b-2828-41a1-9a17-67c40692da81', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6ea16e50-eb14-4aa0-8b19-2190aed8818b', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 5, 1350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a8912f18-440e-4355-b7cd-c99ba5c60fe8', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 6, 455, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b4c9d2c7-a892-414a-a967-f3df592613c3', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c8039903-713b-44f7-8296-8e1de3a356d7', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '81c1c399-9f37-4cef-a5ad-85aa0c8717f2', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '96af3bd2-8d6b-4581-8a23-c6e1ef785e01', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b5f49f91-63e5-4f99-afed-69bae2352d26', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ca0acd21-8137-4c4c-96d5-af24918679c4', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e93dceed-30d6-4c92-889f-ed72839d354c', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7bbfa451-1d13-4112-b14b-5c3ed49912e8', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 14, 1750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aef9a101-46ac-402a-a4f1-95f3da2c4ee2', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '1b9131b8-a884-4873-9ac3-c4da4d6f77ce', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6651fbab-101d-4465-8c1c-c4b0170288e3', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ecc6040e-99bc-4be9-8493-0aaa0d56fbbf', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 2, 1450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2d0e8488-14df-4719-bf51-f1686458f78a', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 3, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4e3d9aa0-c373-459b-981a-bb894ef932ab', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 4, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bc56ba2d-06ac-400c-8e0a-21df22d50aed', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 5, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dac736e6-9695-4e13-ad31-6bd1751fcde6', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 6, 1400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0c1faf9f-d86d-4cb3-ba11-2bda6ebfe452', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f0c6b524-8808-47c6-addf-10b25ca4674b', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 8, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8f9153ce-cdeb-4a40-958e-3efb3d097e85', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c34c5ee9-b3eb-467d-a2cd-cdb3a4c83687', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ca080e79-b95f-48a6-b9ce-5b0be910c8be', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8e93eec3-ea51-42a3-a353-a240cea540aa', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 12, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '75f3659d-3df8-463a-8e6d-abb52fc9c917', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 13, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e7550561-1705-4395-a1a0-bfc5f79e8e0e', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 14, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bd35a83e-1d71-414e-ad14-9857ba726686', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 15, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '946dc9ef-d7a1-41f7-9926-046997eea4af', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', '55675895-dd87-4300-8ce8-2bc9bbbe9d43', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3fe888e2-90e7-4c2f-ae60-b82a18770e44', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 1, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4735d6bf-db32-4349-87fd-051775e65cf0', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 2, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2614fb47-d044-4bf5-b248-509da496fff0', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 3, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a41550e1-e5e8-4c02-822a-577a4fd1818d', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 4, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bfc74c5c-06b3-47a8-a8ec-811fa86858d7', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 5, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b5721132-13dc-4967-b30d-91eb13338761', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7fda56a6-9f55-4d57-9649-dcb4daccf511', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 7, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6eca5fb2-2092-4db2-a9ce-c6422b4f578e', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 8, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3a127710-42e2-419e-8325-6cf75010a470', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 9, 950, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '057bb4a4-74ec-485c-8ea1-d947cd525de8', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 10, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2a6726cc-7d0f-4b48-bfa6-fdb6864ab4ce', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd6c2d4d5-8fde-4030-a14f-c0b9214b6c83', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '05b51773-f329-4424-a31e-2a86f3e818d3', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '90953d36-4803-4140-bc9c-379f8bcf79d4', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 14, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e3631bd7-7db4-4395-9b95-1369e7c09112', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ed660a10-f57a-41a7-ae89-05e9b4b69a29', 15, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dd0bd4d2-5885-4a36-b63b-eb1c002d884d', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 1, 1650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e07f0c70-037b-43d1-9b8e-fa0781f3a3df', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 2, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '11d1c6d8-b71a-403d-aa22-fbf679b85e2d', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 3, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ba193e49-11f0-423d-b539-9880815f2ef9', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 4, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '72345db4-4708-4229-afd8-d0963a892faf', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 5, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a7ae9c4f-12ad-40b1-b372-23ff3379544e', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 6, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1d4c6207-c62c-445b-80de-582e65e74aca', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8524bbf0-18a0-40aa-bd30-2616c9a5464d', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '594e95d4-bf4a-4b9f-9efd-01072056b498', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8414fdec-e03c-4cef-b272-ef163c3a781c', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 10, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3b886d89-6fc0-45cf-ba2b-4b743960ceff', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c12d8212-b100-41aa-b15d-6074c9962c50', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 12, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd6b36b0a-f831-46ba-927e-1df1b78a2e06', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 13, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '97394745-5554-4d88-9ee5-bc05ecc61f67', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ee09ffe5-add0-42dc-aa13-04388f91b781', '894d5e01-89c0-4fae-81ac-bbdd97dabc1e', 'ecb67ddb-c84d-458a-a850-2814e3d9438f', 15, 450, false, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = 'ecb67ddb-c84d-458a-a850-2814e3d9438f',
    winning_score = 10400
WHERE id = '894d5e01-89c0-4fae-81ac-bbdd97dabc1e';

-- ============================================================
-- IMPORT SUMMARY
-- ============================================================
-- Games imported: 16
-- Total player records: 84
-- Total turn records: 1351
-- Unique player names: 18
-- Players: Alex, Barrett, Ben, Brandon, Brittany, Casey, Emily, John, Jordan, Kent, Mason, Mike, Nick, Paige, Paul, Payton, Tammy, Vance
-- ============================================================

-- To claim guest players after they sign up, use:
-- database/manual/claim_guest_player.sql
