-- ============================================================
-- 10K Scorekeeper - Game Import SQL
-- Generated: 2025-12-14 14:02:25
-- Source: 10k Tracker.xlsx
-- ============================================================
--
-- Run this in Supabase SQL Editor
-- All players are created as guests (is_guest=true, user_id=NULL)
-- Use database/manual/claim_guest_player.sql to link accounts later
--
-- ============================================================

-- ============================================================
-- SETUP: Create importer profile (required for game FK)
-- ============================================================
INSERT INTO profiles (id, email, display_name, created_at, updated_at)
VALUES (
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'game-importer@10k-scorekeeper.local',
    'Game Importer',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- GAME 1: Game 1
-- Players: Paige, Brandon, Kent
-- Rounds: 16
-- Winner: Paige (10800 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    '9SNIRB',
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
    'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', NULL, 'Paige', true, true, 10800, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'f79ec252-19b8-4b40-b616-92ef3cd0ebde', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', NULL, 'Brandon', true, true, 8200, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', NULL, 'Kent', true, true, 9750, 3, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '60cf8190-5a6f-4358-baf9-f8f309bf11c7', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '77691fdb-36df-4a96-946c-cf9fb4e75503', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 2, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b0efee4c-46b2-4f85-bccd-64016a1d1010', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 3, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c347d82a-97c3-47f5-a550-aec72f6d8520', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 4, 1450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7f6cb3b7-d0a0-484f-909f-fe790533653e', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 5, 1800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '98b5b6d2-edaf-40f1-859e-ed516eb3cbef', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 6, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2a69d289-edfd-4aae-b35c-049c5a75b5f3', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '883535c8-2478-4821-9ed3-c962a98b038a', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 8, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '48776dae-d887-40aa-b81e-53132673ab65', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ebf95d64-b44b-4a78-9a0d-40b305feec49', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 10, 1500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c995224b-9b78-4fd0-97c8-1ebe1d6c80d6', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 11, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '586d6cea-f99c-4cf3-8ac8-7cc68c41b166', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a472f5b3-fea1-4604-be4c-28c6e409df0a', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 13, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0ba3d854-d45d-4184-a24c-b9f9e090a8ea', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8dab3890-f2c8-48d5-b89f-7a4327be2e48', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 15, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8641df32-b195-463c-96b8-f07854c885ab', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2', 16, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e3840b97-1f10-4a47-871e-ac5120dc8195', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 1, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd4d40f17-cbb5-4cd8-b248-4b8e6b48ee99', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 2, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f1ce07dd-d186-440e-b9e4-e49a7e0fe397', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 3, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3f6cd5b1-9232-4f88-aa84-7ccdf432efbf', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd7a84e02-df35-45bd-9df7-d0e30b8c5f65', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 5, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6d162606-7d98-4c9d-807a-dd9436465f93', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 6, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '62d602d5-76fb-4411-b0db-b033d3bb01cb', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 7, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'af3705bb-7553-4261-8dee-cf131bf6dc03', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4aa02fd7-a800-4870-a217-438eb36c37ed', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '008c8b2e-bd7f-4179-b497-a01473bb4892', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 10, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '602d85e9-9cec-4f76-8a31-9ef31e8553d1', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 11, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4ac22764-87ac-425c-b0e5-24c1934d711b', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 12, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f7fb64a6-219f-4433-9e13-fe9dd1afa59f', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6a308d4e-7a9b-4393-86e2-17e76212cf27', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 14, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2f201c01-86bd-40b7-8862-ff5fe8128fd9', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '222af708-5340-4cfb-a62c-872c17e0259b', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f79ec252-19b8-4b40-b616-92ef3cd0ebde', 16, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '340ed7ac-b5a4-46bc-99ac-6b8179c64438', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4ed37d3b-dc6e-443d-9a28-14b522bdb3eb', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 2, 1650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b1343f49-4cf6-4d0f-97d5-8adf7c177a40', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 3, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f7f60651-c203-4c29-8cb5-980f01ccdde7', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 4, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e7af6482-1034-4b7b-aebe-aa2939bf7d21', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2ba9f8cf-8511-45ee-a22d-b8ae881401a4', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '67b88b8c-3e78-4090-bcf9-1035994ff933', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 7, 1550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f6b31747-20f4-454c-8f56-f380d580e19e', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 8, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8e10cfe2-448b-433e-8213-15c892e41074', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 9, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b2cfc09d-600c-471c-a098-1a52579c7db6', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '175378c3-39a5-45dd-8433-ba8182674b96', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 11, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a1d51402-aac0-46ab-b57f-69cd62172d0e', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 12, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7d88120d-381b-408d-8e9e-eeeebcfca71d', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '42e50d7d-b45d-4233-a5e4-e733f0886764', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f8f4736e-c951-4c70-a45a-a6b7ebef3c80', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 15, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4095327f-1b5d-40e7-93a0-7e00a2a61eb9', '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde', 'f9be53cb-55ed-4b93-91ad-e0bf3139f0fc', 16, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = 'ef2e8bf1-7e15-49bc-afc6-153462c82eb2',
    winning_score = 10800
WHERE id = '50d4ccaa-8955-4cfb-bbc8-541ce9e18fde';

-- ============================================================
-- GAME 2: Game 2
-- Players: Brandon, Paige, Mason, Barrett, Brittany
-- Rounds: 21
-- Winner: Barrett (11600 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '6c372905-f7b3-4073-b29c-644ca748cea5',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'FV5248',
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
    'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', '6c372905-f7b3-4073-b29c-644ca748cea5', NULL, 'Brandon', true, true, 9600, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '593bb629-f6af-4cb9-ad80-bd5e07313128', '6c372905-f7b3-4073-b29c-644ca748cea5', NULL, 'Paige', true, true, 10200, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '1a452622-5606-4239-9d95-ce88644b8601', '6c372905-f7b3-4073-b29c-644ca748cea5', NULL, 'Mason', true, true, 5850, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'f39a85b4-7b05-4408-b85d-e650b30b5f79', '6c372905-f7b3-4073-b29c-644ca748cea5', NULL, 'Barrett', true, true, 11600, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'a044c5d3-844c-4e77-b632-2c19e93046a8', '6c372905-f7b3-4073-b29c-644ca748cea5', NULL, 'Brittany', true, true, 10500, 5, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '33c7c173-3297-4ede-9006-06e5585ad921', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 1, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ed0ee04c-f324-44b3-8976-21f3644b0c73', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 2, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '87a084b1-f105-48e5-8f3d-cdab99ddb469', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 3, 2400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '04507993-3d30-466f-892c-ee5486f3c63a', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5e7daad7-6885-43df-baea-1bbcc03dbfe3', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 5, 1400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '575419ed-0053-45fc-8fa3-b49b31e4ce65', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3f2baed2-5aab-4fa1-bf52-ccf43368c881', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 7, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '700303a3-8ad8-4952-9517-43a760ad2d97', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 8, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7622e269-594d-49bb-bbba-89c512c669bd', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6c7da465-c092-47e0-8214-616c8e21cb09', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 10, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8b66f5b7-3733-404c-a733-31a74fd581ad', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 11, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '402a32bf-9731-417d-9963-97186dd5edad', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '021fa1cc-6a50-47d3-a877-b5b04809f430', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4d7bd443-2910-4f57-a4ab-82e6ce47aa0d', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 14, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '338bf8a4-24a3-476d-985a-be884b320d5f', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 15, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '54d472a4-db6b-44e0-bd56-4fca1764f074', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7f9ad13a-464e-4166-94c4-db3beaad55c7', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 17, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6dfb2c4a-2baa-4d37-8019-fd0e07ca7eb0', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5fe2b162-e366-4475-b24f-c9fb6b42d3eb', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 19, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9fc0df2f-b850-457a-98b4-f35fc78f334d', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 20, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '33097a04-f61b-47e9-9213-a67260413a64', '6c372905-f7b3-4073-b29c-644ca748cea5', 'fad5b13c-e4e4-4b90-a824-deedc18d8f3f', 21, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f9ca95a0-7e8b-4a72-9d5e-d6961431215a', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 1, 950, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '31561043-e709-4c71-9dbc-e20ddbbeb232', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 2, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f533913d-db3f-462c-9430-fddd10c5e2d4', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 3, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '57dc28f6-0f99-4e18-af95-76baf8909f82', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 4, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '99402e83-05e9-432d-a7cb-baaf5efb4a09', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 5, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '91a8718a-9553-41eb-b54b-4562f9e8e284', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 6, 1650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0c5aa143-c482-49e4-97bc-d524f029ffed', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 7, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8fceac83-02a6-4759-9de9-d37dacedb71e', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 8, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b6602221-6bd5-45a3-a3dd-05d3e393871c', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd5b64292-a1bd-4c24-8ddd-e75274396eff', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 10, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9b384d61-1822-49fb-8527-c20ff5072b9d', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 11, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2adbee01-7f73-4488-bf88-cac99be27b83', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 12, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '26e45f0c-02e3-4242-ad35-19128328b5cb', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '94be58fc-129b-48d1-93eb-accfbf11e18a', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 14, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '63107138-c24c-45c5-9561-739e73de22c8', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '35d5b214-195c-4f4e-8d22-ed9571ebcf3a', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '21b48bb7-76b0-479c-9aa7-d7ded18dac24', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eee55ac6-3295-4512-b2e6-812a14ed4ffe', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '33ba9d31-0063-45ff-828c-aa00a5c15045', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 19, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '243034c7-2685-4c12-aa73-9824319e6982', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 20, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a1ddf158-3e83-4506-b90d-eca814fe7805', '6c372905-f7b3-4073-b29c-644ca748cea5', '593bb629-f6af-4cb9-ad80-bd5e07313128', 21, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1ae567ba-462b-4c2e-8fdd-a93ea4ea302d', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '78a11e31-1949-48dc-989d-f96102a559bb', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bebb4fd7-a493-4fac-b00b-9a1e872fce95', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd310dd9a-949c-4028-b145-d1d37a7b11b1', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5d84798b-48c9-4744-9b6e-4ebfba4a948f', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '03813ec5-e107-4a95-a95f-71c34976c8ce', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 6, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '594021c7-e3fa-4063-9bfd-a96420fd9056', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 7, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '98898e58-0a60-4174-b587-e263695c65af', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 8, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '876e1a8c-43ab-4ffa-b4fb-2f10fdb593df', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd61b7762-041d-40f2-8efe-78b9d7c859e0', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1e889111-4e01-4644-9a35-87dd56a42040', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2988ee3e-dddb-4b5b-b4b1-441680456068', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 12, 1400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '58e05967-c836-4709-a60c-bc7a6627fb05', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9e007af8-b7d4-4a80-8bc3-d2518066a68b', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 14, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '26314341-b030-408c-93e9-c93402821e5c', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 15, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'af9c7ba9-a8c5-4f62-a8ca-78cbe1be529d', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 16, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd7194188-e66a-4139-af26-e4ac36d9ba2b', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 17, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd6bbd101-7a50-48e9-b2fc-1d1c07ef51a3', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4b120623-b5ae-4cda-aab0-3728aa226ac8', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 19, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8dca069d-2240-4c91-b47c-f313af7b4b1b', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 20, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '53e9703d-57a5-433b-ac67-c294e5abbe4d', '6c372905-f7b3-4073-b29c-644ca748cea5', '1a452622-5606-4239-9d95-ce88644b8601', 21, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9b784f18-5630-4ffa-b37c-a11aacd08f7f', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 1, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c294dbe8-64f0-4bf5-8d2a-5b51f68c6948', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c5a78c99-b126-48e2-8b97-e001ffd38593', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 3, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '88e3ed66-e2cb-453c-82e5-c9e128dbd27b', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6d5f666d-1f68-4096-8a93-7d5c3a9c6b7b', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 5, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '92388ae9-3f35-4db9-aded-67c4df37951b', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 6, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '86d636ee-36b5-423c-add6-7f440dd7f59d', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'db46a28c-c56f-448b-8ac2-94daca6c83c3', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 8, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '617e8c44-eb01-4f62-91ea-41dc32c9d7e2', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 9, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2093b353-ee88-4a96-a5fd-7927dde19d34', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd42bf8ed-2c42-4fcd-b87b-231adb95f7b0', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 11, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '21ea2c79-150c-4d10-bb85-b47e168a42ec', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 12, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2646a89d-f561-4332-b01f-8e73304126a0', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 13, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4b68c0d1-2fae-4c73-ad1d-8d82b33a97d7', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 14, 1850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b0fddf16-9701-498d-9038-0ee630d1bc80', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '40379a01-710e-4b14-9c49-64bb85823afb', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 16, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e57c5fa5-dab1-46e4-883c-321d759a4706', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 17, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2ef7ae1a-d7fa-408b-b255-d374135eab46', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 18, 1950, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fe886cfa-1e32-4ee1-bd40-32357c05fdd6', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 19, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd3bed6bd-e861-4fea-a508-adb33baf1286', '6c372905-f7b3-4073-b29c-644ca748cea5', 'f39a85b4-7b05-4408-b85d-e650b30b5f79', 20, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b0eb8593-1a5f-41b5-84ac-2746dbb004fa', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2eac7c49-be12-40de-b57a-01f54a2360dc', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 2, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ef380ad3-13a0-4393-9b93-6be2370f3ab1', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 3, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '587b7e18-72d3-4c52-b240-ad132398b92d', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 4, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2289c6c7-e345-4af9-88f3-291532b63e27', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 5, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '150b01ad-bd0d-485a-a55e-dbb822c8c55f', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 6, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6e685105-498e-4dec-ad5a-bfe2b5324258', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 7, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '46ff0ef1-0379-4c88-9b40-29b50a99803b', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 8, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '634ac216-116f-46b8-9118-5766e16d860a', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 9, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1361766e-42a9-4d57-aacb-53fc6d8344c2', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 10, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '83c9169e-a3a8-4a1c-8382-294ad22c6cd6', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 11, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dcfcedcc-e431-4fc2-8f02-67a736864684', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 12, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '007d0846-5e26-4994-8732-38f1985631fb', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '941384eb-48c9-4b8d-a751-22a3b8b4c14f', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 14, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '81e63c53-f4f1-4c99-a3f3-85c7d03ac24c', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '395afb16-09ef-4750-b32e-74e1d52ca73c', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 16, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1ede1169-0335-4dd8-8049-6bd18bf3ab71', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 17, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '06689413-6971-46e5-a001-52d5c0fbc046', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c518ba5f-ff59-4aa2-8d07-bd699a60b2c2', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 19, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '82f9b144-6087-45a1-ac6d-2d13ea75b997', '6c372905-f7b3-4073-b29c-644ca748cea5', 'a044c5d3-844c-4e77-b632-2c19e93046a8', 20, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = 'f39a85b4-7b05-4408-b85d-e650b30b5f79',
    winning_score = 11600
WHERE id = '6c372905-f7b3-4073-b29c-644ca748cea5';

-- ============================================================
-- GAME 3: Game 3
-- Players: Brandon, Mason, Paige, Kent
-- Rounds: 17
-- Winner: Mason (12800 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '925c54e4-f40b-4506-a85c-f2d91a3650d7',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    '2STXXP',
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
    '4bf35a38-5c78-4641-86d5-03408816f1d3', '925c54e4-f40b-4506-a85c-f2d91a3650d7', NULL, 'Brandon', true, true, 9250, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', '925c54e4-f40b-4506-a85c-f2d91a3650d7', NULL, 'Mason', true, true, 12800, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', '925c54e4-f40b-4506-a85c-f2d91a3650d7', NULL, 'Paige', true, true, 10250, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'fcde8bdb-092e-4f76-918b-586336f84f86', '925c54e4-f40b-4506-a85c-f2d91a3650d7', NULL, 'Kent', true, true, 6700, 4, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dee05430-3a8d-4206-8025-fda1ee8348c7', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3239828b-32c0-46f8-819b-40351419896a', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a969cf13-a5dc-44ad-b0da-daa7bd3ca773', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c37e7f24-27f4-4651-a263-9e4cd95eeae3', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '350d59ee-5ec8-45b0-95d2-b814caeeecd8', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 5, 2450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '13ce04c2-7ecb-4dda-b15b-caaf276cda5c', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 6, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '265ee5b2-8d14-45b7-a423-9dff1a08f0a3', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 7, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1ca39cbf-628d-4659-81cd-e92694aa1bf5', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 8, 1750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '10e5e801-8d1b-4d02-afcb-f73fda4cfcf8', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 9, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '41e3c16d-153d-4992-bfe4-52892a549b41', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3d3c22f3-5ccb-431b-a98b-10eb76769c11', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ac4020e6-2634-42c1-a8f7-99cbf56774e4', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 12, 3300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd9ebd701-14f8-436e-9300-141ee20f3a3e', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c11c1dd6-064e-4280-9329-5a8098d9ebd9', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e2185f95-02a7-4038-bead-52ba0be52103', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9f1c989b-d177-481e-8fc8-fdb13e93446e', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fe714c86-7f6c-4bc5-9887-bcc0f87742c3', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '4bf35a38-5c78-4641-86d5-03408816f1d3', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '96abf090-0ccb-48db-be4e-fab1a3b12d17', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6d60397f-928c-4f58-b25a-3abce3394ccd', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 2, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '813b623b-fc4e-4fb4-a822-ee4ccf42416f', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 3, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e4158577-c31b-4ddf-ba9c-d0d0384e8429', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 4, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '97e9fd2f-73cf-4dcc-85b1-c000cb7d9bf4', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 5, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5e4784c0-06c1-41a5-a959-233a8a2f93e1', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 6, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6cb804f6-a938-4b14-901a-1fc9f1b9c966', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 7, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3cdef51e-31b5-40d8-8d61-b182ca93be38', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 8, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '695efe9b-1329-47bb-8c7f-28cf53dca6dc', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6f8a03c1-b25e-4630-a405-c44fa77cbfc1', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 10, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9bd88b10-d48b-4024-a67a-41d5c11e70a1', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 11, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '45629da7-6b17-48c8-94a0-174a42ba6b8f', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 12, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bbe3c4e6-b2d4-4e90-9a99-9f4e86c6d0e9', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 13, 2050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7cf06125-3d80-4406-885d-601d9f2361f4', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 14, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '008a8904-748e-4a5c-8fba-a410738095ac', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '199e4029-8ce9-4f99-b577-f609507f725d', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '5d74d65a-7641-48b8-b4ac-5a7e9ed28741', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f2170f37-e566-4240-9eaa-c368a4a9bec4', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'be880c6d-d7ab-4c28-a847-dea29172edaa', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '78c1a19f-5707-494c-a090-861e75eb0033', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 3, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '020c0b21-5fd5-41e4-8423-7e478613e9b6', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 4, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5bf2593e-8d79-43a2-898d-cce7f8d259ff', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 5, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e6607a44-ae83-4b4a-a7de-fc88be4e220c', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 6, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0df29ff5-a91e-44de-b9ef-da165be7a3b3', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 7, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '184f2e64-c45c-45b4-bd95-c04a88c153f8', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 8, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '35dfd528-80fb-40fc-98ad-c42add972d5c', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 9, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0fdf3ceb-4113-4cab-b19a-9166c891839f', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 10, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8e16e3fd-1764-4fc4-8abf-b0ea9546f040', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 11, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f223dd4b-3903-4532-8571-8b7813b11cc9', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 12, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd36c7e2c-344c-4253-a3d7-5827f06d264f', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 13, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '800a229f-23d2-4c7d-b0e2-49debbff47b0', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 14, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f360cee6-ad1a-4f61-8f35-add762d2cd35', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 15, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '389bac11-4ff0-4be2-a19f-3e642f2363bf', '925c54e4-f40b-4506-a85c-f2d91a3650d7', '7bb7eebc-508e-4a5e-a8b3-aa728b6ff85a', 16, 2450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ec74fc3d-a421-42ad-9ad9-e9834440003b', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f8f87222-89f7-4302-81ba-951c1f9e836e', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7a54c58c-80b8-4a79-bcda-249a300f86ef', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 3, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd84d3b46-1025-4ed2-b634-207ec4610b16', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9a2e1d1f-6a4c-4e6c-a296-a38133c07ff4', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '958b6381-3b2d-4854-947b-c36de881a837', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c64dbfcb-7f71-4ed4-9f3f-3f0affc9c7fd', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4f0bb68f-f84b-471b-99bc-72159f191a80', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '34baea22-88ee-429a-9830-148a04a913df', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 9, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7e8de6ec-28d4-4344-bfe6-524556afef3e', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 10, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0fb9a4f1-87eb-45a8-84e9-2d3cdd9d04e8', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 11, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '25ff2103-c202-4772-acc0-c5ee1e824fb6', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e3a902c0-53cc-4278-8ab4-e9528c63436e', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 13, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9412c4df-3964-4f07-8b7d-837347d25213', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 14, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4454925c-dc56-43f5-bda6-59d5e8cd3163', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 15, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1b60a148-5e6f-4c52-bcc2-7dbed8ccca32', '925c54e4-f40b-4506-a85c-f2d91a3650d7', 'fcde8bdb-092e-4f76-918b-586336f84f86', 16, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '5d74d65a-7641-48b8-b4ac-5a7e9ed28741',
    winning_score = 12800
WHERE id = '925c54e4-f40b-4506-a85c-f2d91a3650d7';

-- ============================================================
-- GAME 4: Game 4
-- Players: Paige, Brandon, Kent, Mason
-- Rounds: 13
-- Winner: Paige (10350 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '438afd84-bde2-4f92-96b5-71c1a88efcc2',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    '7XFR7D',
    'active',
    13,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '0f0bde98-cb7d-471a-ab09-624b92fc21dc', '438afd84-bde2-4f92-96b5-71c1a88efcc2', NULL, 'Paige', true, true, 10350, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '7a8ec63e-7cff-4f16-a140-9ea91307a197', '438afd84-bde2-4f92-96b5-71c1a88efcc2', NULL, 'Brandon', true, true, 10300, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'b53e8b2c-066e-49fd-8bba-9cbc19412778', '438afd84-bde2-4f92-96b5-71c1a88efcc2', NULL, 'Kent', true, true, 2900, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'b4dfead9-5dc8-4a26-a750-e896230c8f89', '438afd84-bde2-4f92-96b5-71c1a88efcc2', NULL, 'Mason', true, true, 7200, 4, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5389f575-a218-48d4-9fcd-1961e505e5ff', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8f6e2a4e-bd66-402d-bd6e-53e72d5a7722', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 2, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9775040e-341e-4489-be1e-8d8833e8e864', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 3, 2100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '53f54150-87e3-4c9c-ad1d-4e168df4416a', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 4, 2150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5f75fea6-1491-4ace-b73b-e9ee40ef6dc6', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 5, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3057a54c-a39d-408e-aa27-c824cb6c03d3', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 6, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5f2adb80-bffd-40db-a963-8e7cbc2c4d88', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 7, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '52ab7a0b-c795-4d4e-9be7-f9a6edfea3a9', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bc88983b-1f06-450a-8fdd-d6270342b7dc', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 9, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '47929bc0-7e21-4a3e-b6ce-d6ca940a6dde', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 10, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fb77e91a-b4fc-4c4b-97c3-6b99867cd946', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 11, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '59c68a51-2af6-4391-8782-4ec00dc3fca9', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 12, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'de7415e1-99d5-4802-80ca-a042ce085703', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '0f0bde98-cb7d-471a-ab09-624b92fc21dc', 13, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aaebae4e-a7c2-4ca3-b728-a9dc0e84c50c', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3db9f833-e001-4a32-a26f-e61e36e68b4c', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 2, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '382e1f48-b9e0-472a-bdb5-97c0ce78032d', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 3, 1400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8324eca4-4030-42fb-862e-feb3d5d587df', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 4, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd10bbebd-6183-44f4-8a8f-d1678619cd8b', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eb0847e0-6c66-4cf7-aeaf-216c2c523854', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 6, 1700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6cff75ac-5ac4-4aa6-a8f2-752969cbb8b4', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 7, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5619eafc-537f-4aa0-9add-3e7b105c8129', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 8, 3000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4c8b617b-fa94-41e8-b5e4-7084cf321039', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd73537fb-e936-4d4f-854b-882bbbfb81b4', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ded03241-7eee-418d-80ba-67033ec960af', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 11, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '72747f5c-3329-4673-9681-3ee25263bdee', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 12, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4719bf13-c9e1-4257-bf58-bfe8882522b2', '438afd84-bde2-4f92-96b5-71c1a88efcc2', '7a8ec63e-7cff-4f16-a140-9ea91307a197', 13, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ba2d923a-ce5d-4464-88ed-b1b677c5121d', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 1, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd5a00f17-bf87-4a2e-954f-9692a01e3a77', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 2, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b9d80bc9-387a-43dd-a775-f286cf4189ea', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8011c648-7680-4e60-918b-4321b790689e', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '08cde492-f2f1-4265-a214-878d688a1ab1', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 5, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b6322509-e55a-458f-a59d-1495881f4074', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3adc290b-d949-4df5-8a65-359f427de172', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '22e2bacd-6a17-4a2f-8467-774e3581b106', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 8, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e58ee22c-1d62-4856-99ad-ac021f03f372', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '18b1b9ec-7adf-422d-9593-c78394015f76', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cb9d9062-83d0-482e-ad3f-72125147942e', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '083f5106-33a8-4291-a708-b95f6863a7a7', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6202cd65-1420-48a5-9488-3cd2b26aa717', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b53e8b2c-066e-49fd-8bba-9cbc19412778', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '680ec29e-6486-4c8e-bc19-e9a1d18fce4a', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 1, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '88fd6df7-b89f-4114-b56e-f4e2e45386ba', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 2, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8322c0da-6315-4648-ac52-e7b89b15cb5e', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 3, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bb8495cf-4574-4013-a48e-ed454df55dc4', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 4, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0bb039d5-ed81-40c6-97a0-fe9045c1e92d', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9db9e6e9-991d-41a0-af0c-9b85ce787a00', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 6, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2787c594-d23f-4c1e-ba44-6a7d470ae681', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '26848c04-6ea9-4367-b619-e07aa524df0f', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8b0c8f80-5a36-4717-ae9c-d08a9cb265d3', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 9, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '76c06778-d1d4-4790-894e-fade214acf4b', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6af0053e-413e-4a2a-8825-fb90a9bf22ae', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 11, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd25ed076-4781-4592-828c-ae81fb0cdccb', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3b057a5d-26a5-460a-aad2-c2d455c8d7cd', '438afd84-bde2-4f92-96b5-71c1a88efcc2', 'b4dfead9-5dc8-4a26-a750-e896230c8f89', 13, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '0f0bde98-cb7d-471a-ab09-624b92fc21dc',
    winning_score = 10350
WHERE id = '438afd84-bde2-4f92-96b5-71c1a88efcc2';

-- ============================================================
-- GAME 5: Game 5
-- Players: Brandon, Paul, Kent, Barrett, Brittany, Paige
-- Rounds: 13
-- Winner: Barrett (10450 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '07bcb57b-5a1c-4607-9b85-fed2ec021e99',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    '45CMW0',
    'active',
    13,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'dc3570a9-0e7c-4acc-a14b-2241c23342e1', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', NULL, 'Brandon', true, true, 3850, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '2ddeec39-ad3e-469a-a308-d077a71df46a', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', NULL, 'Paul', true, true, 4000, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'abf8fd00-f063-438c-a067-da2abe5f62e0', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', NULL, 'Kent', true, true, 6150, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '17997210-b3fa-4304-86b0-4aec915c4cd8', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', NULL, 'Barrett', true, true, 10450, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '49b2d979-4d43-4697-a762-f41590691e9e', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', NULL, 'Brittany', true, true, 5350, 5, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '2088b75a-105a-4c83-adfc-6e4b62de7b30', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', NULL, 'Paige', true, true, 1400, 6, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a82b15c1-66bb-41bf-9f6f-29d1d295e0d9', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 1, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '84aaf22a-4e0e-4317-ae52-6c3ffbbac6e5', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '370133bc-d662-4ead-a437-5ac4b8af20bb', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 3, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fb74d09d-c9af-4c23-a579-efad8d7722ee', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9b3bb938-a6fb-4014-97f5-048b4968b604', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 5, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '50996453-42f4-4c2d-9312-4aa62bbd50c1', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '90cfba93-3bbc-4e82-860d-2221d1f40b84', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 7, 1550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '209f0f9f-cccf-4b09-a875-ebee6e64dc09', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 8, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '298d9580-5b05-4bcc-bb47-cba916ad1795', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ab24b905-3e7f-491a-bc27-be2468ac24e1', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dac01621-8b24-4ae1-8344-f4c322da3afc', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 11, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '537dfc4f-72aa-4ff3-bfb6-3ede13dddfe1', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c6ca97d9-585c-4942-b1a0-9d5128b0129d', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'dc3570a9-0e7c-4acc-a14b-2241c23342e1', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b0a4abfc-57d1-4606-854d-149ccd1cec63', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd14be321-a3fb-4c04-8c0f-4f51ae59636d', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aa853c94-c61d-4705-9cf4-c11a65ee9b8b', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bf5a195c-b7b0-4053-b4b9-6165266463ef', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 4, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7fb29b2d-e834-4538-88b7-943cf255568c', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 5, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ce2fa8cc-e27b-4c83-b382-86f0fefbd66c', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a450c1aa-b8c8-40d0-bd95-b859b09b43ae', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd5920d70-7163-498e-9735-b1559e6a4fcc', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 8, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6285001e-bfc7-499a-8840-863368387f51', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e31366dc-abe5-4c33-8127-d8848f1642d0', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cfafc80a-3c34-4d31-90d0-517f0d3ae924', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 11, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b3067f45-54ed-4224-82e1-17587927e5d5', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '92dc6055-7567-4faa-8810-90f40b96b785', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2ddeec39-ad3e-469a-a308-d077a71df46a', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2fd87d9e-aa45-4f9c-a15d-dd9ff59589b3', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '213977eb-bf36-4172-aff5-e3e8dd89c3bb', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e5ee526c-20b5-4e71-916a-4ea3af8760b5', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 3, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7722db21-4a9b-405c-b267-dc058cb3b19b', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 4, 2900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ef65a7ba-f1d3-40c3-bc8d-8243f508e8ab', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 5, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dda75d79-c227-4371-bd15-f63304f804eb', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 6, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5adfff62-6f4f-4126-af27-1c9f344e9137', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '002ef2e6-be01-45e2-a54c-d6ac581f9c63', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f8682a24-2e10-47df-be7d-0a270c4286b9', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'efe1898f-dd16-41a4-9ce4-d7ac3e9eed5e', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 10, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3c8476eb-36cd-40d1-a76d-5618006e11a1', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ee28ab70-de8b-4c3d-b47a-531fe01785bb', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '82039e77-b563-47e3-a9e7-4e5b16612b50', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', 'abf8fd00-f063-438c-a067-da2abe5f62e0', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '26be8fb6-4fea-4aae-abf6-a1cf59fcb412', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8313eb2b-998d-4bdd-a006-98213f7b36a1', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 2, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd5385d26-4141-4e59-86a0-7e28ed7b7c7a', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 3, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ced09da2-de77-4401-97da-089be4180417', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 4, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f1b1736a-3a60-452d-9a17-5bf1bd4b55d9', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 5, 1500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cbac9eb2-4873-4f2d-aa19-e03a7a46cb4b', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '149770c5-d7a3-4cdd-8794-078ff803aae9', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 7, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ab036d0f-dfe8-4024-abfb-8ff66ac2c16a', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 8, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9eb6d55e-c3a4-486d-97c1-a92efc4106e5', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 9, 2500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5b8968bb-00d9-4096-a2b1-bba43a7c60ef', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 10, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7448351b-cc0a-4597-8f79-5c526b6cbaf8', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 11, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4f76efea-b8c1-48e6-b63a-7ec9fc141057', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '17997210-b3fa-4304-86b0-4aec915c4cd8', 12, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ef6c8e92-bb0a-4615-aeb9-180054cc2ea4', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1600b391-4842-4560-a920-ba74fe809bd4', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 2, 1500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1c9e81c4-431a-4b4a-b0ba-d74947e0379e', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 3, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e8e7c087-f4be-41de-961f-35bc1135bf01', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 4, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '58382959-cb3f-4d22-98a9-6213ed5702bb', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 5, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '936a3b1f-da33-4270-bc42-312c44986b46', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 6, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9c790a91-fb08-4450-839e-e105c6561de9', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ab8eed24-c114-4bcc-bae8-89681d08c048', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b9db726d-a206-4a48-a824-a56c545e5f48', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 9, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '34f3c1fa-9dfc-4a47-884a-c79455dce8f2', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '511ebe09-c1bd-43dd-a920-f9e9543a501f', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 11, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '945f31ca-9dab-4698-bdfc-c38580a6c3f6', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '49b2d979-4d43-4697-a762-f41590691e9e', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a73c3c2b-799d-433a-b891-342dc71c0288', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cb8a1312-ebc7-448d-abfd-c8b2f57a6ad0', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd2748507-4e67-400a-94da-49af84b6a62a', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b6b87454-869a-4d4b-a616-c2718e67ae21', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd357bb62-ac56-4760-b58b-a5044adf8a41', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c4bc75af-692d-42c6-b66c-a5d85b84ec03', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2b37b1c2-5d31-4b9c-99ef-2fb1371a92da', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 7, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c38b38c0-219e-4d21-8232-8e73e0cb41ae', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 8, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5197bfd9-27d9-4130-897a-a51c3bfc0b79', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'da4210ca-2205-4117-bcca-6c6df714080f', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '80ed4b7d-d708-4b45-b1fc-e884d8d24b25', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0a73b008-670d-4a70-b1c1-5c2ebdee1e3c', '07bcb57b-5a1c-4607-9b85-fed2ec021e99', '2088b75a-105a-4c83-adfc-6e4b62de7b30', 12, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '17997210-b3fa-4304-86b0-4aec915c4cd8',
    winning_score = 10450
WHERE id = '07bcb57b-5a1c-4607-9b85-fed2ec021e99';

-- ============================================================
-- GAME 6: Game 6
-- Players: Ben, Mason, Paige, Kent, Brandon
-- Rounds: 18
-- Winner: Brandon (10700 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'IFTXNO',
    'active',
    18,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', NULL, 'Ben', true, true, 8050, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'c3af491b-db6e-4420-ae51-4c499a11d268', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', NULL, 'Mason', true, true, 5950, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', NULL, 'Paige', true, true, 5400, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '468134e6-2dee-47bd-bc07-401ff39dc8e4', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', NULL, 'Kent', true, true, 10000, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', NULL, 'Brandon', true, true, 10700, 5, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8f6ae849-87b1-4cc1-89a4-25a29ec5dc23', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 1, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd861d9ff-5020-4487-a5db-7e5930c7c2a9', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a484b4c6-6ed8-4c85-9f0c-b5ebbf13de6a', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 3, 2800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9806bba9-06b7-4c7b-8ac1-f6b2e712c2ef', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '56be7d53-8445-4b2c-9ec0-5f7ff65008f9', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ef10daf4-c755-4d6c-a617-4b45d075a6ab', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '75996710-203c-4541-877a-f9093dff8ec1', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 7, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '76da3414-6389-4dd2-95b6-f346f9a31311', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 8, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '61c704dc-617e-426b-bab3-395bd96005e9', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7e6bc32f-63e6-46be-b190-02e1adebde06', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 10, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '98a10372-2952-45bb-9ea0-f0265553db1c', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c5c1a40b-9ca2-42b1-8624-d953a5eb2ff9', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 12, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b6ab42d9-a480-4991-b2e1-fa83c52fb112', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b1d94275-b6bc-4db2-9a4b-88a5da5a609f', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '159ef193-d3c3-4b90-8b96-641a5e35d368', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 15, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f4711a84-2d45-46e3-ac18-d31e6eada50c', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 16, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bc73156f-3914-4599-ae81-4c362f3202a7', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bbca91d0-fa1c-4bcc-9ac4-cb3bb60d8336', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'd79b68dc-d4cd-4eaa-9be7-7a73893c6b92', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3d9e4a62-bdd9-49e6-9380-abb76888c826', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ae3d3f23-54cf-43fa-b464-4ce990fe19e5', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 2, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b7875527-b8d5-4745-ba8f-63ef03512188', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0854935a-d68a-4554-a5a0-115da5fdb710', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 4, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '76c1e5ab-c567-489a-8dbb-339ff2fa8e17', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '678c08e1-41c9-404a-a6c8-a2c48977a404', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 6, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a0ccf752-13a5-4be8-b594-4affeeead538', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '245c08f3-d91a-45b9-a84a-e5ac98597c45', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 8, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '72d6e760-f4a7-4dbf-9c79-57e66d273359', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f4ccaabc-ebc8-411d-b5e2-2a320c2ca6ce', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 10, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7a94415e-4775-4c2b-a31d-70b8e7b20ddf', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 11, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4235f0a7-5e7c-4610-adb1-2dadd55021b8', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6bbcf192-a8fc-44da-8de2-85cdfdbc485a', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '56ee2a94-301c-4c5b-aba2-e530b0a3045f', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 14, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '68a28d2c-f867-4d5e-b684-50484ec2c68c', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 15, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '01cafa17-0b2c-4099-b6fc-d0434bb359a9', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c88f9222-da28-48c0-9f58-3690a2f2ad7b', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '73400ca5-fb93-4d8d-a50f-403d09c94ad8', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', 'c3af491b-db6e-4420-ae51-4c499a11d268', 18, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6df8da3a-28f4-479a-8be9-ce8bf780023d', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ef2c85a5-51ed-41fe-97f2-f686281778d1', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2e23e614-916b-49fd-bf57-e977bd453cf2', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd37d07f5-5a3c-48ab-8390-614e4144d170', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '58f941f9-b7b9-45c4-81ed-7d16d1fc0b9a', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 5, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b4a2e19f-7550-4a77-9074-b3e3002975a7', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 6, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd8996e38-9c42-4028-99bc-c3c398236942', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 7, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '70c5fc8c-ce7d-4933-a1f1-bcac275ced2a', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd93f5a31-f9fb-43f1-b59b-b25a517b1c3f', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 9, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '854dd57c-623b-44a4-93e9-8624a00d9933', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6f3b9b2c-818c-4d22-b98e-7cea5b282c36', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fab34896-dd30-48fe-b283-f65aa09e044c', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 12, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '42123f9b-df14-4ddf-aa56-51f528933241', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 13, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '62222d52-bfc6-4a22-a42c-59fd12399ba7', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 14, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '75ed87ab-e46e-4815-9f15-a732ed77852d', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5866902e-b01b-4d4c-8aa3-2a6bc67a35d7', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 16, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '916d2ef0-23b8-41f3-b194-f4e07a2b5e28', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 17, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '23b5e963-0c10-4bba-a2a3-74ddb703e055', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '58ae999e-bd73-49c6-8a1e-d9eced1d2ce2', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dfe6f466-2c8c-4ff2-b83c-109fe8013882', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0b658404-3ca8-4f0f-a0ad-a8921a41e47b', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 2, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1496144e-4e21-4269-9a87-9067e2db548a', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '47e40b7f-a8ea-4612-ac23-58318b374a7e', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 4, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a4ef60cb-04d0-4421-9606-c63ea1896ac0', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 5, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0a8c0973-0994-42bd-aa20-b60b505e3e93', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 6, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aadc6012-e42d-44b9-ae54-38b6cd082d84', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 7, 1500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b1d4b131-9584-4c23-a0be-306a21b19a25', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 8, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c54dbfa8-15a8-4838-86ae-cb2f454d5bef', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3459f862-6b17-4c14-ac5b-67f97e359d4c', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 10, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '32527734-fe3d-482f-865f-ce3712652125', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 11, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4511e28e-889d-4828-a0aa-ee85418f6867', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 12, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ac853d32-aa5c-4831-a3d9-437428a503d8', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 13, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '05b4240a-ad18-472b-bd84-47cff77335ce', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cbccd08c-8572-4327-be83-ef12e37aab03', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 15, 1700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd1d2fc97-02a9-452c-b823-dd4ca22937e9', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e4c9d4b8-3277-436c-b8f1-1d54263bd3a8', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 17, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fb04947a-96a3-4078-bb5f-2999a8d184f0', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '468134e6-2dee-47bd-bc07-401ff39dc8e4', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7dbf9615-cdf6-49cd-9c92-64539e474b78', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 1, 1450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8250c6e8-093d-428b-a87e-77255ee3590e', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 2, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '60b0de2d-a76c-413a-88e0-92bc9426f2db', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e6cec740-27dd-408d-af1c-ca59f76d35a9', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 4, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e41c0579-dae7-483c-bdd5-6e6535deaf83', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 5, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '404f1dd7-dcd4-400f-bbf3-8c20fa88d200', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 6, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4c72ef22-cf9f-4bf1-8a5a-929669d51551', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cd2f54f0-079c-4ed0-9d26-ade577b1ef07', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 8, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2feede5e-99b7-4325-aec1-e97d269e42a3', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 9, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6c09027b-e41a-4fc4-ad94-afe3861ee421', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 10, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1f0c0069-fd4f-4654-b25f-db63c08a8837', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 11, 2200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cfa2b30b-81a9-4b05-bcf5-6620ebf382b4', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5e1ecc72-da69-4305-91cc-5fb118b59d34', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3b035de9-1a7e-4db7-bf28-f073be202ae7', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 14, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '97236e1f-ade9-427a-803b-5b956c99e5ce', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '623a19ef-047c-4c13-8626-f1e7c527b7d7', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e05812e6-88d7-4e6e-9c3b-e79e143653c7', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 17, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '630ab52a-49e3-465e-acd0-ab5a030e4432', '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3', '47cba408-c9be-48ac-81c4-7ca42bdf7fb0', 18, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '47cba408-c9be-48ac-81c4-7ca42bdf7fb0',
    winning_score = 10700
WHERE id = '9e5c3177-0a9d-4f94-9f0a-26d5b8496ce3';

-- ============================================================
-- GAME 7: Game 7
-- Players: Brandon, Ben, Mason, Paige, Kent
-- Rounds: 20
-- Winner: Ben (10450 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '89266b2f-526a-487c-a1c0-84372755c2c3',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    '1RQ3C8',
    'active',
    20,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', '89266b2f-526a-487c-a1c0-84372755c2c3', NULL, 'Brandon', true, true, 8000, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '9efda430-6a42-4429-968f-34740a0842ed', '89266b2f-526a-487c-a1c0-84372755c2c3', NULL, 'Ben', true, true, 10450, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'd67beced-8027-439d-a46c-769768556628', '89266b2f-526a-487c-a1c0-84372755c2c3', NULL, 'Mason', true, true, 8550, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '70f9af25-70c0-4299-a72e-0322e4a93ae5', '89266b2f-526a-487c-a1c0-84372755c2c3', NULL, 'Paige', true, true, 7650, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '4e136910-1367-403d-91a4-866b6aa775bd', '89266b2f-526a-487c-a1c0-84372755c2c3', NULL, 'Kent', true, true, 10300, 5, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cb57b35a-83d3-4007-a3bf-db764624fa36', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 1, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '62872d2e-d7fa-434a-9a00-a3af141ba636', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '33d23a7c-4f71-4315-9500-22d9e94da77b', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 3, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b39bdb0b-07bb-40a0-832b-ecd7c16cf078', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 4, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '86520119-ede4-4b42-82bb-ad645f9846a7', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 5, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4642dcc5-1152-4cf6-940e-f2810c89aabc', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 6, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b142891a-62c2-4f59-8b34-f0e53b04fc54', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1473c855-fe84-47e1-ac57-fc75e900f783', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 8, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd5766811-7ebf-4553-b519-73cd2030ed45', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 9, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cb155b3f-ec58-4ab4-9fe8-237f69c02e81', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a2493cfa-7067-4efe-bf89-111202f2dd7b', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7d7d078d-e6bc-4036-8dc0-df36bcfaebc7', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 12, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '47196414-0b1d-4a2a-8056-00c2bf7094c6', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2546632a-df60-4bf7-95ac-2e7a1ff68737', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 14, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '689f8a26-227a-4d4b-84a4-4c90fdeb9762', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 15, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '759af8e7-6591-4a78-b12b-e811af8d2b7f', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 16, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5a92cec5-8add-4eb7-b3aa-3456122118ae', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 17, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0912a283-b863-496d-ae9d-dcf1542f9c32', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ac335d3b-d536-4cda-8189-00e0c52d7a08', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 19, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '89928993-ef68-4f29-9f80-ee8c2914bd0b', '89266b2f-526a-487c-a1c0-84372755c2c3', '5d68c730-8104-4afc-9a8a-9e8d5da3de3d', 20, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '09700da9-130c-4c5a-83ee-9bf8366416f4', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 1, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3e643553-5df0-4909-9f87-e2432013961e', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 2, 1700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5238d8fe-88d9-4098-bd98-16d1589c39c9', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 3, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f027c0ff-2478-4810-8924-42634488556d', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 4, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a22de138-a5db-4590-a6cd-2f5415f19449', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2de11526-9468-4e5f-af38-cda788590974', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 6, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '00eb033e-0774-4389-9225-a329725f5a6e', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cee161e6-aed6-4eda-8a88-46ac0273d0cf', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 8, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cd559aaa-96b0-4c6f-9514-ab8cba264605', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 9, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ca273664-b084-4075-9847-8a3728904af9', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 10, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f91dee8b-1535-4b78-93d7-6d2cb80b984d', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 11, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ab83c7a1-6a04-46f8-a7cf-b8a939216304', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 12, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f2424a91-d4f4-4220-b2da-a13ac8245e3c', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 13, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '28fb0063-7941-42f5-9be9-6df63b8dbe84', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 14, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cdffd057-ccbd-4e4a-a954-18355d763c27', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 15, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5ce45c8a-de9f-4122-8d83-1c8ce1759c45', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 16, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aed2b344-13b9-48fa-87d5-d3fc7cbc522c', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9931815e-699a-4716-96bb-641742ed90db', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1c48356f-e60f-40f5-ab0d-bf72be35805f', '89266b2f-526a-487c-a1c0-84372755c2c3', '9efda430-6a42-4429-968f-34740a0842ed', 19, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '29c5c639-3b6a-4bb0-84e9-4e30545930ec', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 1, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '84869987-203e-4048-a11c-02aa7b2caa17', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5bbd71ef-268f-489d-9d35-540a1f15e4f1', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 3, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a39ecaa8-cd5f-4406-9963-a633db401f19', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 4, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e8cf6b32-6530-416d-ae3b-db4b718ac3bc', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 5, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '887c7685-a14e-49e4-a546-1edf6f30a8be', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3fe4ee16-657b-43f0-8f1a-b01b7727cfb0', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 7, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ba09509e-e4a7-45f6-800d-2840a4102e80', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1498bc3a-a94b-4252-96f7-b684f8c1903c', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9a73d41d-82d8-4b67-9678-0c34ff1ba17e', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bc2dec80-bb80-4ac6-8412-f9c68d205c87', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 11, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8aa7029e-be2e-4e46-9066-a18d6ce8de85', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ed5633d6-f5b8-4ad1-9b71-052da2716160', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e53c3cc7-47dc-4ebe-a418-8225b3197133', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a1a78e7d-36fc-4e09-9fb5-b6188fb03002', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 15, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bfa1d5ff-9f8b-48f3-b659-6bc4d070c405', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0bbd4600-a66e-48e2-92a3-46023753ccf4', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd682ceeb-594b-4c7a-90ab-77a6b889821c', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 18, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '78b1e1f2-0d77-4381-9999-b8cd37269d3f', '89266b2f-526a-487c-a1c0-84372755c2c3', 'd67beced-8027-439d-a46c-769768556628', 19, 2600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b9edec3d-a408-4d46-919f-a19672b25e51', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '189e96d4-c9f7-4b86-854b-0e3a0d1edb0a', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eb4735d1-6676-417a-b3a9-b36b753cb800', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 3, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c614c27e-7569-4539-b05e-d90c33276731', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 4, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b34b18c6-2456-4864-b0fc-72035999b44b', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 5, 1450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '72c2ce42-8c97-4435-b7c6-f6e6c9584ab1', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 6, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e9f29eaf-e1d6-43be-9e4e-5037ce0dce79', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 7, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1abf7bd2-d610-4c48-a334-3dc2abb761df', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b71ea910-5029-4a50-bdc6-531ab69b7df8', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 9, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2225bf88-94f3-4c66-a79d-577c61868165', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b91c0b34-d19d-4a4d-8dce-25abd11d9392', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 11, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a90b81c6-3a29-4423-b6e5-a87400414518', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a975140f-e0b8-4e34-9247-74646ca85490', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '61007a26-9ab1-4bb9-a845-6da55b648145', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 14, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '92e0e5e6-e272-4cab-aad0-ddaec381712f', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6cc188d4-52e2-4c9e-a552-1a1ab17221ed', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5ba7012f-a017-4828-8945-9a0dafd39841', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '890573f2-1ef9-4a94-ad6a-579b2c4bf026', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 18, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f05fd1e9-4daf-432d-9be4-70b0f9c6cdb2', '89266b2f-526a-487c-a1c0-84372755c2c3', '70f9af25-70c0-4299-a72e-0322e4a93ae5', 19, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0a888428-f9f2-4bbf-92cb-4f6b08e59b25', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '779d50ea-9d67-4909-b140-f413bf8f8210', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '26d19be3-ce68-4eb7-8eef-8aac59f86025', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 3, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ec42cb64-d18e-4ed5-9e6f-e3363875acb4', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 4, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '32de13cf-b554-4ef4-b15c-f50050585379', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0fd58fe0-8d8a-4815-bc00-558705a8a725', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 6, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '944de577-419e-4452-bf95-fae84328761d', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 7, 2300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd9fac590-7f4f-4aae-8362-bce3224b3c6d', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 8, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8233b2be-67ea-4aea-a827-4c3cb081c4ae', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 9, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9333d864-9a55-4670-bbcf-4feb1b307160', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 10, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4394a732-709d-4dc9-803f-d712960c9b79', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 11, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '10e72d2e-9d08-4f51-b9f4-942af14d987f', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 12, 1800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5809b1fb-b7f9-40c4-92d5-cc9a0a6d4570', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 13, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4f796350-f920-4b89-9b4b-a970083a6a5f', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 14, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '034aa49d-8b96-4a45-9688-5fb1b1a753f1', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '635b2d85-5ce7-40b4-bb1f-ab40100db918', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '482d4b28-d12d-4385-8ecf-04301ffa5898', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 17, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '420b642f-3b4d-47e3-9aa6-80b9160b18af', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e0292362-af12-4e6a-b81a-59658213342c', '89266b2f-526a-487c-a1c0-84372755c2c3', '4e136910-1367-403d-91a4-866b6aa775bd', 19, 0, true, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '9efda430-6a42-4429-968f-34740a0842ed',
    winning_score = 10450
WHERE id = '89266b2f-526a-487c-a1c0-84372755c2c3';

-- ============================================================
-- GAME 8: Game 8
-- Players: Paige, Brandon, Ben, Kent
-- Rounds: 25
-- Winner: Kent (10550 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '84817abf-5297-4377-8849-67b111a78683',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    '9BO1AL',
    'active',
    25,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '52d75475-363a-45fd-88c8-8937ce354b6c', '84817abf-5297-4377-8849-67b111a78683', NULL, 'Paige', true, true, 10200, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '8c6ecff9-3c3f-48a9-babe-777593b24298', '84817abf-5297-4377-8849-67b111a78683', NULL, 'Brandon', true, true, 10850, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', '84817abf-5297-4377-8849-67b111a78683', NULL, 'Ben', true, true, 9350, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '2ab63651-8a82-434f-83b7-9f641e8bd249', '84817abf-5297-4377-8849-67b111a78683', NULL, 'Kent', true, true, 10550, 4, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8c1a20e9-ba38-4138-b1d3-a19e8af68ed7', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aaac318b-e6ee-4f14-b239-82e8c1a59210', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 2, 1650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ec9f5e6c-8e13-4105-bc4f-622a366262de', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 3, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ca1f0aa6-eee5-49b0-befc-c051acfeaaed', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 4, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c4fb9b43-76d9-4b55-a8e8-86308014573e', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 5, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6c8df7eb-9547-4e62-b381-59fcd3796a73', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1736b003-2405-42c5-9b35-228ef592bd27', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8c44de8b-8682-41a2-b6ef-32c510cf7f97', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '83d0dec3-5a52-4b3c-b8e1-2459b7562210', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9f18ad53-9c41-4235-a89c-a48477a88a76', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 10, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9f45fea6-7116-4842-bd8a-d996dd6eccbd', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 11, 2550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '66569060-d84d-4e85-9940-fdea72c1063b', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 12, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9d2ad460-8311-4427-958a-53b28724a32d', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5e559752-f88a-438d-9505-8f6ce8a8dff8', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 14, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7feed06e-91cb-4cd9-8bdc-eabecbcb61d3', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '631a5644-d0a0-4a0a-9b92-13c5c88663f7', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '550c132e-3708-40f8-aead-c631e15cea31', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd8e302fc-9c83-40bf-bc28-a0c2e2426bf7', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '61172c24-fe6e-44bb-9705-2e15a1985293', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 19, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '666905b9-1590-4958-b4e1-de8dffdbcc05', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 20, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0531ab5c-4cd1-4011-b321-f4b020dc44bd', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 21, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8c352959-30b5-4315-aa92-8db5c43f3ffb', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 22, 750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '09bd28ac-014b-4f59-8136-d3ec149c8e99', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 23, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9d371304-d181-4aeb-9765-adb6b06d6f1c', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 24, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '18ef4248-4ba9-4fd9-b077-951698d56380', '84817abf-5297-4377-8849-67b111a78683', '52d75475-363a-45fd-88c8-8937ce354b6c', 25, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8a909407-859e-49da-9d06-726836506afc', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ac3a6e55-8c71-4619-9cd6-6efc41325c65', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'feb27d8d-eeab-4a88-9e97-f880018df7e6', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '592dd157-3fac-4c4d-9947-0b1806fa22a0', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ac0d559e-8cbc-4a53-828f-66dd9b4f62a7', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0d86cb3d-1d31-4168-b35c-36b930d851e6', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 6, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '570eeff3-7e8b-4d76-b27d-0c8350a08954', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 7, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0adb0b84-518e-4259-81c6-1409b3e2f804', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 8, 3050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd9a5cee1-c029-40f6-9822-78e3d8b256ef', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2cb97edd-3d12-4280-84a0-267a1c18d49b', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '21881898-8aec-4c6f-a47a-f5324053a2cc', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 11, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4cc8e6a0-9d7a-4a2b-9c24-8220b4d50fda', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 12, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c804895d-7d92-4836-bd70-171dc213da50', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 13, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0ced8351-9bcc-4e08-8ddd-6b376dea6f67', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1a37bced-e5df-42d5-a14d-6d93d3b9b016', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '676309ae-6150-4a06-873a-5f71354b8141', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 16, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ca2ee858-3d47-4bec-912a-3548a5c2eac8', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f102163b-5639-43a7-a06f-9372fe291ee4', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 18, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2eefa6f5-0819-4177-bcfa-9db5e5070dfe', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 19, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '850199d9-2603-40f2-a173-1a69d8d4812e', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 20, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '290f3485-2d27-4e48-837e-a8c3e53618f5', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 21, 1250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2aab29c7-36e9-4197-b54e-2c7388f0d30b', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 22, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a1372cd3-50f5-4f35-bdbc-03806ee9c206', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 23, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f4cf0779-cdef-4cfb-9346-1aaa23ca73d5', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 24, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aa7f398e-d48a-4c69-a96d-fc1ffcb8cbb9', '84817abf-5297-4377-8849-67b111a78683', '8c6ecff9-3c3f-48a9-babe-777593b24298', 25, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c65a0d27-3abe-4a0e-be5a-9e0914e517a4', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aa460674-d5e1-4ff0-a3c5-028eba0237ba', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 2, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '90b21bcd-0cc3-489b-a6cd-cfb37e16a443', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ee5b67f2-bfe1-4552-acdd-d5af1503f56b', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 4, 1350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ad07b3c0-120a-4f4f-a5a8-090c440a657f', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '64ddf7e3-27bb-4313-897c-16d7174efbaa', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4e5bffed-bfd7-49a3-84bc-e12e385d4852', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 7, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5a761303-565e-4942-b068-4daeb2957c89', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 8, 2000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3c7fb807-8ff9-4008-9743-97c5687fbcc4', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '12deaf5d-2f16-4656-a4f5-9024751519ec', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2666cb25-a61e-4bd9-a724-936a5d1cf9e8', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3e700a54-dc09-4c63-97fa-c52c75eab0ca', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 12, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a21cb7a6-3513-4f94-99d9-0e61937448b5', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f36a9eb9-b1f4-42f2-8344-0d7b8fc09d79', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 14, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1a7da1c4-6e8b-43e2-8cd5-b07ba2a12d03', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 15, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '64acb700-2183-4ba1-84ab-ff5278b28759', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bcfd828c-3479-4c63-b6c7-17e8ed7f7127', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e4783c56-9e8c-4522-a33c-cde891f76f2b', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 18, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '98b5bf1d-7fa9-4a0e-b016-b85f46e436b0', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 19, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '34081d4b-b2ea-427b-8507-c8b46b05719b', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 20, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '06e957a5-a351-4547-9ffb-3f2dfeea0e04', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 21, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '455a5824-0c52-4c69-97f5-a053d2c65cb8', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 22, 650, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0c20fccf-e9d4-4060-856a-c5dbffa226b2', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 23, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '870a6307-0b8d-4450-9f24-1dbc7dc5fdb4', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 24, 550, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8a81d366-88e1-4903-ab32-b67c25711c07', '84817abf-5297-4377-8849-67b111a78683', '4ead0c3a-aeb4-42e0-af18-45b79b301fe0', 25, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0d118b12-ee66-46bc-8314-ee9e0f39901c', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0a66a4b1-8841-4ac5-88ab-9bfffadced4a', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '39ea5314-14a3-4e58-a105-5093aade1035', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 3, 1500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '04b6a93d-d659-4c50-b3e3-6db76f871ee2', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 4, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '226b542d-e5fb-4215-aefa-4b94775dc64e', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 5, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '96715831-7198-41d5-aac3-d339ae0a756a', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'b411434e-70a7-4c45-89f3-69066fd6f854', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 7, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '691ba4da-4f01-4a2b-9dd5-3c6d23d53d6d', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 8, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e93d2dca-4f1b-45b1-a049-9f46fa43c8cd', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 9, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a5af4925-4e14-4d63-89c9-3f533530671b', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bf2c53f9-bf57-4360-853a-3c8d80023ab3', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 11, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '91ea8e48-6072-462e-afc4-5acb3493c3aa', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 12, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5d72eb4e-5d8c-4c93-bf0d-6a71e4793c95', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 13, 1850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1df1cde0-4fdf-49e1-a741-d343c5347fbe', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 14, 850, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd0cf68fe-bc06-4e7d-b98c-aa8ad498762c', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3aafd176-0c7d-4113-bed4-fff936c67972', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '913c85e0-9d0a-4926-9f13-c77a7f12230b', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '48224c21-a43d-4ee5-8f91-c4959c7ea4e8', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0c3359e9-7529-4dfa-aeb7-7783a04f9a0f', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 19, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1558f8fe-1add-4838-96ab-b62ae1af7705', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 20, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1a5c191e-557b-40b6-b36c-ea3cacb8ffa2', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 21, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8fe1bd19-5717-4f77-b153-f1ff85fa56d1', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 22, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '6d660c61-4049-4b0b-9598-99013ce64d2b', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 23, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7be6dce1-3cb7-43a1-811b-b9f970d2c746', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 24, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bb04adea-bdfd-4a88-84f4-831fa04fbf22', '84817abf-5297-4377-8849-67b111a78683', '2ab63651-8a82-434f-83b7-9f641e8bd249', 25, 750, false, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = '2ab63651-8a82-434f-83b7-9f641e8bd249',
    winning_score = 10550
WHERE id = '84817abf-5297-4377-8849-67b111a78683';

-- ============================================================
-- GAME 9: Game 9
-- Players: Brittany, Paige, Brandon, Mason, Barrett
-- Rounds: 19
-- Winner: Barrett (10200 pts)
-- ============================================================

-- Game record (insert as active, will finalize after players)
INSERT INTO games (
    id, created_by_user_id, join_code, status, total_rounds,
    winning_player_id, winning_score, created_at, updated_at, finished_at
) VALUES (
    '190c37a1-eb3b-4202-a9b6-6fd91c2908f5',
    'bd7a6ed5-cab1-400b-915d-794633d1b83a',
    'PAJAD1',
    'active',
    19,
    NULL,
    NULL,
    NOW(), NOW(), NOW()
);

-- Players (first player = game creator)
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '86a8368d-7fd4-483f-87eb-4b97410be9a7', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', NULL, 'Brittany', true, true, 7200, 1, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'fb3ba263-7041-40e6-ab7c-548193ca81d2', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', NULL, 'Paige', true, true, 7250, 2, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '85dcc211-1ab9-4179-9c01-7aee9071af95', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', NULL, 'Brandon', true, true, 10000, 3, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', NULL, 'Mason', true, true, 7000, 4, NOW()
);
INSERT INTO game_players (
    id, game_id, user_id, player_name, is_guest, is_on_board, total_score, display_order, created_at
) VALUES (
    'db313e1c-12c7-4404-8220-edd44978fc13', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', NULL, 'Barrett', true, true, 10200, 5, NOW()
);

-- Turns
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0b062d4c-34f4-4b17-97c6-8e9e68fa0691', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 1, 1050, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4a6714cd-3b42-4543-a56a-37efa854b5e2', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 2, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1afafae5-29c6-490e-9692-5d47b68ebd3a', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 3, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'eb1db17e-6cc4-461a-a6ef-c577a1609c75', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 4, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dfff89d6-d017-4214-921a-f6a3c6c4ed82', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 5, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4524d2b0-ba43-4085-8371-c4aa09e5e4d2', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 6, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '332050dd-3de3-4cc0-8bc4-3111094d5672', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 7, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '34a0ae8b-28d2-488f-a403-6cf3b37a8a4b', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '3a388ebe-60af-4882-bf74-2369c961999b', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '17c49645-87cb-4810-ad6b-14f17c0440fb', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 10, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7cbedadc-ad21-48da-9bd6-4ce4d80697e1', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 11, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0272c2b8-60ad-4b66-950a-73c18e2fe16f', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bf0da3b6-595e-4936-a732-e15927e8e263', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '11a46805-5c84-441c-9ccc-f8353c3bb3e8', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c6ee6ee5-b429-4fb6-8864-63a8f533cee3', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'da0fc75d-2d4c-438c-84ff-2892efb1c30f', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 16, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7c4dd0b1-dd58-4c4a-a8f0-ca601373dd13', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 17, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd6adb1a5-8277-47de-a639-3e34ecd417d9', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 18, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '84393be8-e566-49a3-a8d4-955065e391de', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '86a8368d-7fd4-483f-87eb-4b97410be9a7', 19, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7c6bee3a-64f3-4c20-9c90-de4abde1c8da', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8a97d2ef-311b-4d9f-92c4-9c52c95969de', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '550e7157-7b91-4225-8e39-053509760d92', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 3, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dac824be-0d3a-43d4-821e-68f719943d3d', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 4, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a706c1e4-a759-4d25-ac00-c637472f3308', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2d519030-af8d-40c3-a88b-e7181a687eae', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 6, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bec08f2b-95fb-4df5-bfb9-e46149dfd09d', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 7, 1200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f2a3f86f-ea59-42a5-a71d-9f33950a414a', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 8, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '63f085a4-b6f4-4100-84da-69e5bf09199f', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 9, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '606b11b8-0f8d-4892-9f9a-a9406dc8f114', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 10, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f281cb43-d178-4d4b-a8b8-f746e2ede1b1', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 11, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2b0db725-051d-4bee-97c5-74bdbaec76cf', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 12, 1100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fc197ebd-8baf-400c-b552-5855ab492933', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 13, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f6414b91-2a20-4f4c-809d-18c3a1341ab9', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 14, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0351065c-f929-450a-aed5-72cecef2e8e9', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 15, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '95f01268-52b1-4434-b9b4-71ffe6a53a0d', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'fb3ba263-7041-40e6-ab7c-548193ca81d2', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'cb8dacab-796e-4d40-a93c-21170f0a0dc7', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 1, 2200, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c756ed59-2ed1-4bb6-b2ea-6b311f25758c', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 2, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '222e1c57-ebca-4c7a-96c3-2c716f82134b', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 3, 1750, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '39bfb297-ee89-4e2e-a552-224c4fa19a97', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'aa66622a-64ee-4bd1-801a-3d803fdb3654', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 5, 2100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2c1d1aac-6fca-455b-a60c-607b178e5e08', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 6, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '42008f27-08fc-433b-a9f0-b8469815bf05', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 7, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0c37f6aa-b198-464f-85d4-7211888b8f88', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a297c98d-5adf-4124-83dc-104752c12b81', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 9, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4390f8c6-f749-4330-b477-325ebdcb1fe2', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 10, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1d834346-e8fe-4b67-a9ff-9d45b55c6cb1', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 11, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2b7f6377-4adf-4327-936f-74895b63fd79', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'a819bc18-acfa-44bc-be7c-609164fdcd49', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 13, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2c3e8b00-53e2-45c8-a12b-bcaa05df5b5a', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 14, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '2a8ddbeb-cc42-48e0-b247-2ec7ff0e121b', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 15, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '90fa3c29-bb60-4ce0-b1a0-0b9e69a61c51', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '08a41d56-b7c2-4705-bab0-147f528ab2c5', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 17, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '28328894-6191-4ec5-b18d-fb53cd57b0aa', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '85dcc211-1ab9-4179-9c01-7aee9071af95', 18, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'edc95c4f-1357-4c63-8834-8d8b13ebe237', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ceb8e907-ee8d-4816-a21e-5b93d77db725', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 2, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '9736867f-82d6-4964-a91d-835856a9d412', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 3, 1300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5e2248f7-8591-4887-a1a9-da4e85578ab5', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f737a7bc-1339-4399-ac94-e3949c474ecd', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 5, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dc9b0db8-55e0-4ea1-a62d-a05d2cdcc2ec', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 6, 250, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5340af17-0b59-40b5-82a0-3732e51a34e8', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 7, 500, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c7a9fe16-fb7b-4895-936d-b80eefc6fd0d', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 8, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'fc1622a0-4d34-4e87-9719-bd836b564342', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 9, 1000, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '382bbed6-a9bc-4c26-b31d-1687bc7f2444', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 10, 450, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '8e72231e-66c7-4ade-b264-b7b08bf5c806', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 11, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e18f6fe5-b8e8-47b9-bed7-47383aaf044b', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 12, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f05ffc70-ad14-45db-a4ab-519986a41f7e', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 13, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '65902dab-ffa2-4fb2-bbb9-72a154346f80', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 14, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'e11ac5f5-e5e0-47e7-b785-8f292d6f8b6a', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 15, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'c46ed50b-0c90-43d4-be98-fda1efe8fe8f', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 16, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'dcb2984c-2654-4865-9fc5-cf11a1848ae9', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 17, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4b836ccf-1e02-47aa-b7ef-809dde4785dd', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', '2d765aee-c72b-4b83-a7e9-d09a16ce04bf', 18, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '5bb7f12e-6347-4821-9229-700c1516159d', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 1, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '7f1468b9-21f0-4e24-afd1-32eb5d0a387d', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 2, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '919a1daa-1286-414c-b842-f04249a64b25', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 3, 350, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'da18474b-8733-49da-b81f-3b38b284cf21', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 4, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'acfea6ed-8eee-417f-9ee8-51945c455e1f', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 5, 900, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ccfa3c19-17ba-4919-929e-11fd0cfd33c6', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 6, 400, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'bcc20894-405c-4450-8a1f-55af9da80d0c', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 7, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '0d2d0ab5-2bd9-4b19-9668-9000ac07a4e7', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 8, 2100, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '29bf421a-63b9-4bdc-9aa5-bfe8c115367c', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 9, 1150, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'f4b1a085-dc31-45e4-b848-1947aa1f8d9d', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 10, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'd873be18-05cd-4434-8185-8682e044d05a', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 11, 700, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '87e909a6-4071-42b3-a0d9-c3760b7f9f8d', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 12, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '4d00217b-c5e8-4180-84e8-e921719780fb', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 13, 800, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '378feb99-47bd-4621-ade0-7167d8107e0b', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 14, 600, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    'ee9cabb9-3dc7-46d5-8336-fc011c9f04f1', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 15, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '637df823-2f13-4e78-b120-ae072aed92b0', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 16, 0, true, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '1d7b63e1-fe3a-4b56-b20e-3326915934a8', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 17, 300, false, true, NOW()
);
INSERT INTO turns (
    id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at
) VALUES (
    '21429add-3252-444d-bef4-4d6e161afbf2', '190c37a1-eb3b-4202-a9b6-6fd91c2908f5', 'db313e1c-12c7-4404-8220-edd44978fc13', 18, 1500, false, true, NOW()
);

-- Finalize game (set winner and status)
UPDATE games SET
    status = 'ended',
    winning_player_id = 'db313e1c-12c7-4404-8220-edd44978fc13',
    winning_score = 10200
WHERE id = '190c37a1-eb3b-4202-a9b6-6fd91c2908f5';

