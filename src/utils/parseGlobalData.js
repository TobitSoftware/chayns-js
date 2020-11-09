import {isNumber, isObject} from './is';
import {environment} from '../chayns/environment';

export function parseGlobalData(data) {
    let globalData = {
        site: {tapp: {}},
        user: {},
        device: {},
        app: {}
    };

    if (isObject(data.AppInfo)) {
        const appInfo = data.AppInfo;
        const cm = parseInt(environment._parameters.colormode || appInfo.colorMode, 10);

        const site = {
            'id': appInfo.SiteID,
            'locationId': appInfo.LocationID,
            'locationPersonId': appInfo.LocationPersonID,
            'title': appInfo.Title,
            'language': appInfo.Language,
            'tapps': (appInfo.Tapps || []).map(parseTapp),
            'facebookAppId': appInfo.FacebookAppID,
            'facebookPageId': appInfo.FacebookPageID,
            'color': appInfo.color || `#${environment.parameters.color}`,
            'colorMode': isNumber(cm) ? cm : undefined,
            'version': appInfo.Version,
            'domain': appInfo.domain,
            'font': appInfo.FontID,
            'environment': appInfo.Environment,
            'tapp': {},
            'disposition': appInfo.Disposition,
            'headlineFontId': appInfo.headlineFontId,
            'urlHash': appInfo.urlHash
        };

        if (appInfo.TappSelected) {
            site.tapp = parseTapp(appInfo.TappSelected);
            if (environment._parameters.parenttappid) {
                site.tapp.parent = {'id': parseInt(environment._parameters.parenttappid, 10)};
            }
        }

        if (appInfo.CurrentUrl) {
            site.url = appInfo.CurrentUrl;
        }

        globalData = {
            ...globalData,
            isInFacebookFrame: !!appInfo.IsFacebookFrame,
            site
        };
    }

    if (environment._parameters.tappid) {
        globalData.site.tapp.id = parseInt(environment._parameters.tappid, 10);
    }

    if (isObject(data.AppUser)) {
        const appUser = data.AppUser;

        const user = {
            'name': appUser.FacebookUserName || '',
            'firstName': appUser.FirstName,
            'lastName': appUser.LastName,
            'id': parseInt(appUser.TobitUserID, 10) || 0,
            'personId': appUser.PersonID || '',
            'tobitAccessToken': appUser.TobitAccessToken || '',
            'groups': (appUser.UACGroups || []).map(parseGroup),
            'isAuthenticated': !!(appUser.TobitAccessToken && appUser.TobitAccessToken.length > 0),
            'adminMode': !!appUser.AdminMode
        };

        user.isAdmin = user.groups.findIndex((g) => g.id === 1) !== -1;

        globalData = {
            ...globalData,
            user
        }
    }

    if (isObject(data.Device)) {
        const deviceData = data.Device;

        const app = {
            'flavor': data.AppInfo.AppFlavor
        };

        const device = {
            'languageId': deviceData.LanguageID,
            'model': deviceData.Model,
            'uid': deviceData.UID,
            'systemName': deviceData.SystemName,
            'version': deviceData.SystemVersion,
            'imei': deviceData.IMEI,
            'fontScale': deviceData.FontScale,
            'dfaceVersion': data.AppInfo.DfaceVersion,
            'minLogLevel': deviceData.MinLogLevel,
            'deviceAccessToken': deviceData.DeviceAccessToken,
        };

        globalData = {
            ...globalData,
            device,
            app
        }
    }

    return globalData;
}

// parser methods
function parseGroup(group) {
    return group ? {
        'id': group.GroupID,
        'name': group.Name,
        'isSystemGroup': group.IsSystemGroup,
        'isActive': !!group.Active
    } : undefined;
}

function parseTapp(tapp) {
    return tapp ? {
        'id': tapp.TappID || tapp.Id,
        'showName': tapp.ShowName,
        'internalName': tapp.InternalName,
        'isExclusiveView': tapp.ExclusiveMode || tapp.isExclusiveView,
        'isSubTapp': tapp.isSubTapp,
        'sortId': tapp.SortID,
        'userGroupIds': tapp.UserGroupIds || tapp.UACGroupIDs,
        'customUrl': tapp.customUrl,
        'isHiddenFromMenu': tapp.HideFromMenu,
        'icon': tapp.Icon ? tapp.Icon.source : null,
        'iconType': tapp.Icon ? tapp.Icon.type : null,
        'minAge': tapp.minAge
    } : undefined;
}
